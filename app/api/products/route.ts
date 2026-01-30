import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyAccessToken } from "@/lib/jwt";
import { PERMISSIONS } from "@/lib/constants";

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

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let query = {};
        if (category && category !== 'All Products') {
            query = { category: category };
        }

        const products = await Product.find(query).sort({ createdAt: -1 }).lean();
        const formattedProducts = products.map((product: any) => ({
            ...product,
            id: product._id.toString(),
        }));
        return NextResponse.json({ success: true, data: formattedProducts });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const user = validatePermission(request, PERMISSIONS.MANAGE_PRODUCTS);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const body = await request.json();

        // Basic validation
        if (!body.name || !body.price) {
            return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
        }

        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to create product' }, { status: 400 });
    }
}
