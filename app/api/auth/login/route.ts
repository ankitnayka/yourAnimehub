import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const { email, password } = result.data;

        await dbConnect();

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = generateRefreshToken(user._id.toString());

        // Save refresh token to DB
        user.refreshToken = refreshToken;
        await user.save();

        // Set Refresh Token HttpOnly Cookie
        const cookieStore = await cookies();
        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return NextResponse.json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
