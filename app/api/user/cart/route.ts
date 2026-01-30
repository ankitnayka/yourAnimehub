import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAccessToken } from "@/lib/jwt";

// Helper to get user from token
const getUserFromToken = (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    return verifyAccessToken(token);
};

export async function GET(request: Request) {
    await dbConnect();
    try {
        const decoded = getUserFromToken(request);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await User.findById(decoded.id).select('cart');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: user.cart || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const decoded = getUserFromToken(request);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { cart } = await request.json();

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { cart: cart },
            { new: true, runValidators: true }
        );

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Cart synchronized' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to sync cart' }, { status: 400 });
    }
}
