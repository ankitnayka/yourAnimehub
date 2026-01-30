import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { verifyAccessToken } from '@/lib/jwt';
import { PERMISSIONS } from '@/lib/constants';

const validateOrReject = (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return false;
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (!decoded) return false;

    if (decoded.role === 'super-admin' || decoded.role === 'admin') return true;
    if (decoded.role === 'sub-admin' && decoded.permissions?.includes(PERMISSIONS.MANAGE_CATEGORIES)) return true;
    return false;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!validateOrReject(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;

    try {
        const body = await req.json();
        await dbConnect();
        const category = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!validateOrReject(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;

    try {
        await dbConnect();
        const category = await Category.findByIdAndDelete(id);
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
