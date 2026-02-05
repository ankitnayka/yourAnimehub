import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import otpGenerator from 'otp-generator';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const result = forgotPasswordSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { email } = result.data;

        await dbConnect();

        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'User with this email does not exist' }, { status: 404 });
        }

        // 2. Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

        // 3. Save OTP to DB (Expires in 10 minutes)
        user.otp = {
            code: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins from now
        };
        await user.save();

        // 4. Send Email
        const message = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #000;">Reset Your Password</h2>
                <p>You requested a password reset. Use the OTP below to proceed:</p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you didn't request this, strictly ignore this email.</p>
            </div>
        `;

        await sendEmail(user.email, 'Your Password Reset OTP - Fash', message);

        return NextResponse.json({ message: 'OTP sent to your email' });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
