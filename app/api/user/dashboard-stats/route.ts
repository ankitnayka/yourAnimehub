import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/jwt';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to get authenticated user ID
async function getUserId(req: NextRequest): Promise<string | null> {
    // 1. Check Bearer Token (Custom Auth)
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        if (token && token !== 'session-auth') {
            try {
                const decoded = verifyToken(token);
                if (decoded?.id) return decoded.id;
            } catch { }
        }
    }

    // 2. Check NextAuth Session (Google Auth)
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        return session.user.id;
    }

    return null;
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userId);
        const ordersCount = await Order.countDocuments({ user: userId });

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
