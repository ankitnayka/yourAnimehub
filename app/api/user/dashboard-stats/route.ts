import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/jwt';

const getUserFromRequest = (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
};

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const userDecoded = getUserFromRequest(req);
        if (!userDecoded) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userDecoded.id);
        const ordersCount = await Order.countDocuments({ user: userDecoded.id });

        return NextResponse.json({
            success: true,
            stats: {
                ordersCount,
                wishlistCount: user?.wishlist?.length || 0,
                addressesCount: user?.addresses?.length || 0
            }
        });

    } catch (error) {
        console.error('Dashboard Stats Error', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
