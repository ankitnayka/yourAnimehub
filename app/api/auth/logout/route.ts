import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyRefreshToken } from '@/lib/jwt';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (refreshToken) {
            const decoded = verifyRefreshToken(refreshToken);
            if (decoded) {
                await dbConnect();
                // Remove refresh token from DB
                await User.updateOne({ _id: decoded.userId }, { $unset: { refreshToken: 1 } });
            }
        }

        // Clear the cookie
        cookieStore.set('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/',
        });

        // Also clear accessToken
        cookieStore.set('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/',
        });

        return NextResponse.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        // Even if error, we should clear the cookie
        const cookieStore = await cookies();
        cookieStore.set('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
        });
        cookieStore.set('accessToken', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
        });
        return NextResponse.json({ message: 'Logged out' });
    }
}
