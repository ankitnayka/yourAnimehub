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

export async function GET(request: Request) {
    await dbConnect();
    try {
        const user = validatePermission(request, PERMISSIONS.MANAGE_SETTINGS);
        if (!user) return NextResponse.json({ error: 'Unauthorized: Staff Only' }, { status: 403 });

        const slides = await HeroSlide.find().sort({ order: 1 });
        return NextResponse.json({ success: true, data: slides });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch slides' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const user = validatePermission(request, PERMISSIONS.MANAGE_SETTINGS);
        if (!user) return NextResponse.json({ error: 'Unauthorized: Staff Only' }, { status: 403 });

        const body = await request.json();

        if (!body.title || !body.mediaUrl) {
            return NextResponse.json({ error: 'Title and Media URL are required' }, { status: 400 });
        }

        const slide = await HeroSlide.create(body);
        return NextResponse.json({ success: true, data: slide }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to create slide' }, { status: 400 });
    }
}
