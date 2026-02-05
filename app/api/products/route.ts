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
        const slug = searchParams.get('slug');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sizes = searchParams.get('sizes'); // comma separated
        const featured = searchParams.get('featured');
        const newArrival = searchParams.get('new');
        const sort = searchParams.get('sort');
        const search = searchParams.get('search'); // Add search param

        let query: any = {};

        // Search Filter
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive search on name
        }

        // Category Filter
        if (category && category !== 'All Products') {
            query.category = category;
        }

        // Slug Filter
        if (slug) {
            query.slug = slug;
        }

        // Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Size Filter
        if (sizes) {
            const sizeList = sizes.split(',');
            query.sizes = { $in: sizeList };
        }

        // Featured Filter
        if (featured === 'true') {
            query.isFeatured = true;
        }

        // New Arrival Filter (either via explicit param or could be implicit via sort)
        if (newArrival === 'true') {
            query.isNewArrival = true;
        }

        // Determine Sort
        let sortOption: any = { createdAt: -1 }; // Default: Newest first
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        // if (sort === 'newest') sortOption = { createdAt: -1 }; // Already default

        const products = await Product.find(query).sort(sortOption).lean();
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
        if (!user) {
            // Check if it's a token issue or permission issue
            const authHeader = request.headers.get('Authorization');
            if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

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
