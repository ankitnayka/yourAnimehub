import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/jwt';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createRazorpayOrder } from '@/lib/razorpay';
import { generateOrderReceipt } from '@/lib/orderHelpers';

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
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Fetch the order
        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Verify order belongs to user
        if (order.userId.toString() !== userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized to process this order' },
                { status: 403 }
            );
        }

        // Create Razorpay order
        const receipt = generateOrderReceipt();
        const razorpayOrder = await createRazorpayOrder(
            order.totalAmount,
            receipt,
            {
                orderId: order._id.toString(),
                userId
            }
        );

        if (!razorpayOrder.success || !razorpayOrder.order) {
            return NextResponse.json(
                { success: false, message: 'Failed to create Razorpay order' },
                { status: 500 }
            );
        }

        // Update order with Razorpay order ID
        order.razorpayOrderId = razorpayOrder.order.id;
        await order.save();

        return NextResponse.json({
            success: true,
            data: {
                orderId: razorpayOrder.order.id,
                amount: razorpayOrder.order.amount,
                currency: razorpayOrder.order.currency,
                orderDbId: order._id
            }
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create payment order' },
            { status: 500 }
        );
    }
}
