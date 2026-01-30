import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NavbarItem from '@/models/NavbarItem';
import { verifyAccessToken } from '@/lib/jwt';
import { PERMISSIONS } from '@/lib/constants';

const validateOrReject = (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return false;
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (!decoded) return false;

    if (decoded.role === 'super-admin' || decoded.role === 'admin') return true;
    if (decoded.role === 'sub-admin' && decoded.permissions?.includes(PERMISSIONS.MANAGE_NAVBAR)) return true;
    return false;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!validateOrReject(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;

    try {
        const body = await req.json();
        await dbConnect();
        const item = await NavbarItem.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!validateOrReject(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;

    try {
        await dbConnect();
        const item = await NavbarItem.findByIdAndDelete(id);
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Item deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
