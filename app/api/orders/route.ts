import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendOrderNotifications } from "@/lib/notifications";

// GET - Fetch user's orders
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        let userId: string | undefined;

        // 1. Try Bearer token
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (token) {
            try {
                const decoded = await verifyToken(token);
                if (decoded && decoded.id) {
                    userId = decoded.id;
                }
            } catch {
                // Ignore token error, try session
            }
        }

        // 2. Try NextAuth session
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

        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ userId });

        return NextResponse.json({
            success: true,
            data: orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST - Create new order
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        let userId: string | undefined;
        let session: any = null;

        // 1. Try Bearer token
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

        // 2. Try NextAuth session
        if (!userId) {
            session = await getServerSession(authOptions);
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
        const { shippingAddress, paymentMethod } = body;

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.name || !shippingAddress.street ||
            !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip ||
            !shippingAddress.country || !shippingAddress.phone) {
            return NextResponse.json(
                { success: false, message: 'Complete shipping address is required' },
                { status: 400 }
            );
        }

        // Validate payment method
        if (!paymentMethod || !['COD', 'Online'].includes(paymentMethod)) {
            return NextResponse.json(
                { success: false, message: 'Invalid payment method' },
                { status: 400 }
            );
        }

        // Get user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Cart is empty' },
                { status: 400 }
            );
        }

        // Validate stock for all items
        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json(
                    { success: false, message: `Product ${item.title} not found` },
                    { status: 404 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { success: false, message: `Insufficient stock for ${item.title}` },
                    { status: 400 }
                );
            }
        }

        // Create order
        const order = await Order.create({
            userId,
            orderItems: cart.items,
            totalAmount: cart.totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
            orderStatus: 'Pending'
        });

        // For COD orders, reduce stock immediately and clear cart
        if (paymentMethod === 'COD') {
            // Reduce stock
            for (const item of cart.items) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } }
                );
            }

            // Send Notifications
            try {
                await sendOrderNotifications({
                    email: session?.user?.email || (shippingAddress as any).email || "user@example.com", // Fallback if email not found
                    phone: shippingAddress.phone,
                    name: shippingAddress.name,
                    orderId: order._id as string,
                    totalAmount: order.totalAmount,
                    items: order.orderItems
                });
            } catch (err) {
                console.error("Notification error:", err);
            }

            // Clear cart
            cart.items = [];
            await cart.save();

            return NextResponse.json({
                success: true,
                message: 'Order placed successfully',
                data: order
            });
        }

        // For online payment, return order for Razorpay processing
        return NextResponse.json({
            success: true,
            message: 'Order created, proceed to payment',
            data: order,
            requiresPayment: true
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create order' },
            { status: 500 }
        );
    }
}
