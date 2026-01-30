import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NavbarItem from '@/models/NavbarItem';
import { verifyAccessToken } from '@/lib/jwt';
import { PERMISSIONS } from '@/lib/constants';

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

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Public/Admin shared endpoint technically, but let's assume this is for Admin listing.
        // Public navbar fetch might use a different route or just this one with a check? 
        // For now, let's keep GET open or lightly guarded. 
        // Actually, the main implementation plan says "Protect all /admin routes". 
        // Admin UI uses this to LIST items to edit. Public UI needs a way to fetch them too.
        // Let's protect POST/PUT/DELETE, but maybe leave GET open? 
        // Or better: Create a separate public API route `/api/navbar` later if needed.
        // This is `/api/admin/navbar`, so it MUST be protected.

        const user = validatePermission(req, PERMISSIONS.MANAGE_NAVBAR);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const items = await NavbarItem.find({}).sort({ order: 1 });
        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = validatePermission(req, PERMISSIONS.MANAGE_NAVBAR);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const body = await req.json();
        await dbConnect();

        const item = await NavbarItem.create(body);
        return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
