import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAccessToken } from "@/lib/jwt";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to get authenticated user ID
async function getUserId(req: Request): Promise<string | null> {
    // 1. Check Bearer Token (Custom Auth)
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        if (token && token !== 'session-auth') {
            const decoded = verifyAccessToken(token);
            if (decoded?.userId) return decoded.userId; // verifyAccessToken returns userId, not id
        }
    }

    // 2. Check NextAuth Session (Google Auth)
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        return session.user.id;
    }

    return null;
}

export async function GET(request: Request) {
    await dbConnect();
    try {
        const userId = await getUserId(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await User.findById(userId).select('cart');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: user.cart || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const userId = await getUserId(request);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { cart } = await request.json();

        const user = await User.findByIdAndUpdate(
            userId,
            { cart: cart },
            { new: true, runValidators: true }
        );

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Cart synchronized' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to sync cart' }, { status: 400 });
    }
}
