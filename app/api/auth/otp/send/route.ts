
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendOTP } from '@/lib/twilio';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
        }

        // Check if user exists (optional, depending on flow. For login/reset, usually yes)
        // If it's pure login via OTP, we might create a user if not exists? 
        // For "Forgot Password", user must exist.
        // For "Login via OTP", user must exist or we register them? 
        // Let's assume user must exist for now to link to account.

        const user = await User.findOne({ phone });

        // If we want to allow login via OTP for users who haven't set a phone yet, we might need a different flow 
        // where they provide email + phone first? 
        // Or if strictly "Login via OTP", we expect the phone to be registered.

        // For reset password via OTP, we definitely need the user to exist.

        const result = await sendOTP(phone);

        if (result.success) {
            return NextResponse.json({ success: true, message: 'OTP sent successfully' });
        } else {
            return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 });
        }

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
