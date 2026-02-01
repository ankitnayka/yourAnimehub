import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

const getUserFromRequest = (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
};

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        const userDecoded = getUserFromRequest(req);
        if (!userDecoded) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userDecoded.id,
            { name },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
