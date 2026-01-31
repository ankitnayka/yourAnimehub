import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch user's cart
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        let userId: string | undefined;

        // 1. Try Bearer token
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (token) {
            try {
                const decoded = await verifyToken(token);
                if (decoded && decoded.id) {
                    userId = decoded.id;
                }
            } catch {
                // Ignore
            }
        }

        // 2. Try NextAuth session
        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                userId = session.user.id;
            }
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create empty cart if doesn't exist
            cart = await Cart.create({
                userId,
                items: [],
                totalAmount: 0
            });
        }

        return NextResponse.json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Cart fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}

// POST - Add item to cart or update quantity
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        let userId: string | undefined;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (token) {
            try {
                const decoded = await verifyToken(token);
                if (decoded && decoded.id) {
                    userId = decoded.id;
                }
            } catch {
                // Ignore
            }
        }

        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                userId = session.user.id;
            }
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { productId, quantity = 1, size = null, color = null } = body;

        if (!productId) {
            return NextResponse.json(
                { success: false, message: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Fetch product details
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        // Check stock availability
        if (product.stock < quantity) {
            return NextResponse.json(
                { success: false, message: 'Insufficient stock' },
                { status: 400 }
            );
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: []
            });
        }

        // Calculate discount percentage
        const discountPercentage = product.originalPrice > 0
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            (item: any) => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;

            // Check stock for updated quantity
            if (product.stock < cart.items[existingItemIndex].quantity) {
                return NextResponse.json(
                    { success: false, message: 'Insufficient stock for requested quantity' },
                    { status: 400 }
                );
            }
        } else {
            // Add new item
            cart.items.push({
                productId: product._id,
                title: product.name,
                image: product.image,
                price: product.price,
                originalPrice: product.originalPrice,
                discountPercentage,
                quantity,
                size,
                color,
                slug: product.slug
            });
        }

        await cart.save();

        return NextResponse.json({
            success: true,
            message: 'Item added to cart',
            data: cart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to add item to cart' },
            { status: 500 }
        );
    }
}

// PUT - Sync entire cart (for localStorage migration)
export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        let userId: string | undefined;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (token) {
            try {
                const decoded = await verifyToken(token);
                if (decoded && decoded.id) {
                    userId = decoded.id;
                }
            } catch {
                // Ignore
            }
        }

        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                userId = session.user.id;
            }
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { items } = body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: items || []
            });
        } else {
            cart.items = items || [];
        }

        await cart.save();

        return NextResponse.json({
            success: true,
            message: 'Cart synced successfully',
            data: cart
        });
    } catch (error) {
        console.error('Cart sync error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to sync cart' },
            { status: 500 }
        );
    }
}

// DELETE - Clear cart
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();

        let userId: string | undefined;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (token) {
            try {
                const decoded = await verifyToken(token);
                if (decoded && decoded.id) {
                    userId = decoded.id;
                }
            } catch {
                // Ignore
            }
        }

        if (!userId) {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                userId = session.user.id;
            }
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return NextResponse.json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Cart clear error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to clear cart' },
            { status: 500 }
        );
    }
}
