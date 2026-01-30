import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { verifyAccessToken } from '@/lib/jwt';
import { PERMISSIONS } from '@/lib/constants';

const validateOrReject = (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return false;
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (!decoded) return false;

    if (decoded.role === 'super-admin' || decoded.role === 'admin') return true;
    if (decoded.role === 'sub-admin' && decoded.permissions?.includes(PERMISSIONS.MANAGE_PRODUCTS)) return true;
    return false;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!validateOrReject(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;

    try {
        const body = await req.json();
        await dbConnect();
        const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!validateOrReject(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;

    try {
        await dbConnect();
        const product = await Product.findByIdAndDelete(id);
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
