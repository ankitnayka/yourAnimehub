
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyOTP } from '@/lib/twilio';
import { sign } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { phone, code, isLogin } = await req.json(); // isLogin flag to distinguish between reset and login flows

        if (!phone || !code) {
            return NextResponse.json({ success: false, message: 'Phone and code are required' }, { status: 400 });
        }

        const result = await verifyOTP(phone, code);

        if (!result.success) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found with this phone number' }, { status: 404 });
        }

        if (isLogin) {
            // Generate Token for login
            const token = sign(
                {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            // You might want to set cookie here or return token for client to handle next-auth signIn
            // Since we are using NextAuth, we might need a custom credentials provider handling token 
            // OR we return the token and client uses a custom signIn('credentials', { token }) logic?
            // EASIER: Just return success and let client redirect or handle session. 
            // BUT: NextAuth credentials provider typically needs password. 
            // We can add a custom logic in [...nextauth] to handle "otp-login" type.

            return NextResponse.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }

        return NextResponse.json({ success: true, message: 'OTP verified successfully' });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
