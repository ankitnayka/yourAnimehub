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

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const userDecoded = getUserFromRequest(req);
        if (!userDecoded) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userDecoded.id).select('addresses');
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        return NextResponse.json({
            success: true,
            addresses: user.addresses || []
        });

    } catch (error) {
        console.error("Address GET Error", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const userDecoded = getUserFromRequest(req);
        if (!userDecoded) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const user = await User.findById(userDecoded.id);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        if (body.isDefault) {
            user.addresses.forEach((addr: any) => addr.isDefault = false);
        }

        user.addresses.push(body);
        await user.save();

        return NextResponse.json({
            success: true,
            addresses: user.addresses,
            message: 'Address added successfully'
        });

    } catch (error) {
        console.error("Address POST Error", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        const userDecoded = getUserFromRequest(req);
        if (!userDecoded) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json({ success: false, message: 'Address ID required' }, { status: 400 });
        }

        const user = await User.findById(userDecoded.id);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        const address = user.addresses.id(_id);
        if (!address) {
            return NextResponse.json({ success: false, message: 'Address not found' }, { status: 404 });
        }

        if (updateData.isDefault) {
            user.addresses.forEach((addr: any) => addr.isDefault = false);
        }

        address.set(updateData);
        await user.save();

        return NextResponse.json({
            success: true,
            addresses: user.addresses,
            message: 'Address updated successfully'
        });

    } catch (error) {
        console.error("Address PUT Error", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const userDecoded = getUserFromRequest(req);
        if (!userDecoded) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const addressId = searchParams.get('id');

        if (!addressId) {
            return NextResponse.json({ success: false, message: 'Address ID required' }, { status: 400 });
        }

        const user = await User.findById(userDecoded.id);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        // Filter out the address to delete
        // Mongoose subdocument arrays have a pull method or filter
        user.addresses.pull({ _id: addressId });
        await user.save();

        return NextResponse.json({
            success: true,
            addresses: user.addresses,
            message: 'Address deleted successfully'
        });

    } catch (error) {
        console.error("Address DELETE Error", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
