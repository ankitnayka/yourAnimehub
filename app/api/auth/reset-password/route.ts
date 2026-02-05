import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const result = resetPasswordSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { email, otp, newPassword } = result.data;

        await dbConnect();

        // 1. Find user
        const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Validate OTP
        if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        if (user.otp.code !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        if (new Date() > new Date(user.otp.expiresAt)) {
            return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
        }

        // 3. Update Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // 4. Clear OTP
        user.otp = undefined;
        await user.save();

        return NextResponse.json({ message: 'Password reset successfully. You can now login.' });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
