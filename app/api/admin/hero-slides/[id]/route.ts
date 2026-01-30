import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HeroSlide from '@/models/HeroSlide';
import { verifyAccessToken } from '@/lib/jwt';
import { PERMISSIONS } from '@/lib/constants';

// Helper to validate permission
const validatePermission = (req: Request, requiredPermission: string) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (!decoded) return null;

    if (decoded.role === 'super-admin' || decoded.role === 'admin') return decoded;

    if (decoded.role === 'sub-admin' && decoded.permissions?.includes(requiredPermission)) {
        return decoded;
    }
    return null;
};

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const user = validatePermission(request, PERMISSIONS.MANAGE_SETTINGS);
        if (!user) return NextResponse.json({ error: 'Unauthorized: Staff Only' }, { status: 403 });

        const { id } = await params;
        const body = await request.json();
        const slide = await HeroSlide.findByIdAndUpdate(id, body, { new: true });

        if (!slide) {
            return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: slide });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to update slide' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const user = validatePermission(request, PERMISSIONS.MANAGE_SETTINGS);
        if (!user) return NextResponse.json({ error: 'Unauthorized: Staff Only' }, { status: 403 });

        const { id } = await params;
        const slide = await HeroSlide.findByIdAndDelete(id);

        if (!slide) {
            return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Slide deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to delete slide' }, { status: 400 });
    }
}
