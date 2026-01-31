import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        if (!decoded || !['admin', 'super-admin', 'sub-admin'].includes(decoded.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await dbConnect();

        const role = req.nextUrl.searchParams.get('role');
        let query = {};

        if (role === 'user') {
            query = { role: 'user' };
        } else if (role === 'staff') {
            query = { role: { $in: ['sub-admin', 'admin', 'super-admin'] } };
        } else {
            // Default to staff if no role specified, to maintain backward compatibility
            query = { role: { $in: ['sub-admin', 'admin', 'super-admin'] } };
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        if (!decoded || !['admin', 'super-admin'].includes(decoded.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { name, email, password, role, permissions } = body;

        await dbConnect();
        const existingUser = await User.findOne({ email });
        if (existingUser) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            permissions,
            provider: 'credentials'
        });

        return NextResponse.json({ success: true, data: { id: newUser._id, name, email, role } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
