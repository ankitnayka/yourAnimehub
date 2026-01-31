import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { sendOrderNotifications } from "@/lib/notifications";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        let userId: string | undefined;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (token) {
            try {
                const decoded = await verifyToken(token);
                if (decoded && decoded.id) {
                    userId = decoded.id;
                }
            } catch {
                // Ignore
            }
        }

        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                userId = session.user.id;
            }
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
            return NextResponse.json(
                { success: false, message: 'Missing payment details' },
                { status: 400 }
            );
        }

        // Verify signature
        const isValid = verifyRazorpaySignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValid) {
            // Update order as failed
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'Failed'
            });

            return NextResponse.json(
                { success: false, message: 'Payment verification failed' },
                { status: 400 }
            );
        }

        // Fetch the order
        const order = await Order.findById(orderId).populate('userId');

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Verify order belongs to user
        if (order.userId.toString() !== userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized to verify this payment' },
                { status: 403 }
            );
        }

        // Update order with payment details
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;
        order.paymentStatus = 'Paid';
        order.orderStatus = 'Confirmed';
        await order.save();

        // Reduce stock for all items
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Send Notifications
        try {
            await sendOrderNotifications({
                email: (order.userId as any).email || "user@example.com", // Assuming userId population includes email, if not populated we might need to fetch user
                phone: order.shippingAddress.phone, // Assuming order object has shipping address populated
                name: order.shippingAddress.name,
                orderId: order._id as string,
                totalAmount: order.totalAmount,
                items: order.orderItems
            });
        } catch (err) {
            console.error("Notification error:", err);
        }

        // Clear user's cart
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            data: order
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
