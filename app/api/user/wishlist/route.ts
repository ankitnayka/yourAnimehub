import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Product from '@/models/Product';
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
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        // Fetch products that are in the wishlist
        let products = [];
        if (user.wishlist && user.wishlist.length > 0) {
            products = await Product.find({
                _id: { $in: user.wishlist }
            });
        }

        return NextResponse.json({
            success: true,
            wishlist: products
        });

    } catch (error) {
        console.error('Wishlist fetch error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
