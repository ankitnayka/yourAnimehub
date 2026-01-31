import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Cart from '@/models/Cart';
import { verifyToken } from '@/lib/jwt';

// PATCH - Update item quantity
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        await dbConnect();

        const { itemId } = await params;
        const token = req.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const decoded = await verifyToken(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { quantity } = body;

        if (quantity === undefined || quantity < 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid quantity' },
                { status: 400 }
            );
        }

        const cart = await Cart.findOne({ userId: decoded.id });

        if (!cart) {
            return NextResponse.json(
                { success: false, message: 'Cart not found' },
                { status: 404 }
            );
        }

        const itemIndex = cart.items.findIndex(
            (item: any) => item.productId.toString() === itemId
        );

        if (itemIndex === -1) {
            return NextResponse.json(
                { success: false, message: 'Item not found in cart' },
                { status: 404 }
            );
        }

        if (quantity === 0) {
            // Remove item if quantity is 0
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        return NextResponse.json({
            success: true,
            message: 'Cart updated successfully',
            data: cart
        });
    } catch (error) {
        console.error('Cart update error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update cart' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from cart
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        await dbConnect();

        const { itemId } = await params;
        const token = req.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const decoded = await verifyToken(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        const cart = await Cart.findOne({ userId: decoded.id });

        if (!cart) {
            return NextResponse.json(
                { success: false, message: 'Cart not found' },
                { status: 404 }
            );
        }

        cart.items = cart.items.filter(
            (item: any) => item.productId.toString() !== itemId
        );

        await cart.save();

        return NextResponse.json({
            success: true,
            message: 'Item removed from cart',
            data: cart
        });
    } catch (error) {
        console.error('Cart item delete error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to remove item' },
            { status: 500 }
        );
    }
}
