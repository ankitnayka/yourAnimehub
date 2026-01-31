import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/jwt';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch order details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        await dbConnect();

        const { orderId } = await params;
        let userId: string | undefined;
        let role: string | undefined;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (token) {
            try {
                const decoded = await verifyToken(token);
                if (decoded && decoded.id) {
                    userId = decoded.id;
                    role = decoded.role;
                }
            } catch {
                // Ignore
            }
        }

        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                userId = session.user.id;
                role = (session.user as any).role;
            }
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if user owns this order or is admin
        if (order.userId.toString() !== userId && role !== 'admin' && role !== 'super-admin') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized to view this order' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Order fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PATCH - Update order status (Admin only)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        await dbConnect();

        const { orderId } = await params;

        let userId: string | undefined;
        let role: string | undefined;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (token) {
            try {
                const decoded = await verifyToken(token);
                if (decoded && decoded.id) {
                    userId = decoded.id;
                    role = decoded.role;
                }
            } catch {
                // Ignore
            }
        }

        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                userId = session.user.id;
                role = (session.user as any).role;
            }
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
        if (role !== 'admin' && role !== 'super-admin' && role !== 'sub-admin') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized. Admin access required.' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { orderStatus, paymentStatus } = body;

        const updateData: any = {};

        if (orderStatus) {
            const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
            if (!validStatuses.includes(orderStatus)) {
                return NextResponse.json(
                    { success: false, message: 'Invalid order status' },
                    { status: 400 }
                );
            }
            updateData.orderStatus = orderStatus;
        }

        if (paymentStatus) {
            const validPaymentStatuses = ['Pending', 'Paid', 'Failed'];
            if (!validPaymentStatuses.includes(paymentStatus)) {
                return NextResponse.json(
                    { success: false, message: 'Invalid payment status' },
                    { status: 400 }
                );
            }
            updateData.paymentStatus = paymentStatus;
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Order updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Order update error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update order' },
            { status: 500 }
        );
    }
}
