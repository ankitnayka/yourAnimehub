import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
        }

        // Verify token signature
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
        }

        await dbConnect();

        // Find user and check if refresh token matches db
        // We select refreshToken specifically because it might be set to select: false in schema
        const user = await User.findById(decoded.userId).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
        }

        // Generate new Access Token
        const accessToken = generateAccessToken(user._id.toString(), user.role);

        // Set Access Token Cookie for Middleware
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 60 * 60, // 3 hours
            path: '/',
        });

        return NextResponse.json({ accessToken });

    } catch (error) {
        console.error('Refresh Token error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
