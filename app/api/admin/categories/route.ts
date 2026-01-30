import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { verifyAccessToken } from '@/lib/jwt';
import { PERMISSIONS } from '@/lib/constants';

// Helper to validate permission
const validatePermission = (req: Request, requiredPermission: string) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (!decoded) return null;

    // Super admin has all permissions
    if (decoded.role === 'super-admin' || decoded.role === 'admin') return decoded;

    // Sub admin check
    if (decoded.role === 'sub-admin' && decoded.permissions?.includes(requiredPermission)) {
        return decoded;
    }
    return null;
};

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Public can technically view categories, but this is admin API. 
        // Let's secure it for consistency, or keep it open if frontend needs it? 
        // Usually frontend needs public access. Let's separate Admin API vs Public API or just allow public GET.
        // For /api/admin/* it implies secured. Let's make a general /api/categories for public if needed.
        // But for now, let's keep GET open or minimally secured? 
        // Actually, the main implementation plan said "Protect all /admin routes". 
        // This is /api/admin/categories so it should be protected.
        // We will make a separate /api/categories for public use later if needed.

        const user = validatePermission(req, PERMISSIONS.MANAGE_CATEGORIES);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const categories = await Category.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = validatePermission(req, PERMISSIONS.MANAGE_CATEGORIES);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const body = await req.json();
        await dbConnect();

        const category = await Category.create(body);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 });
        }
        console.error("Category Creation Error:", error); // Added debug log
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
