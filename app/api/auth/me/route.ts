import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/jwt';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            }
        });
    } catch (error) {
        console.error('Me endpoint error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
