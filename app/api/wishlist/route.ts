import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

// GET /api/wishlist - Fetch user wishlist (populated)
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await verifyToken(token);

        if (!decoded || !decoded.id) {
            return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });
        }

        const user = await User.findById(decoded.id).populate("wishlist");
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user.wishlist || [] });

    } catch (error) {
        console.error("Wishlist Fetch Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

// POST /api/wishlist - Add item
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await verifyToken(token);

        if (!decoded || !decoded.id) {
            return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            // If it's not a valid ObjectId (e.g., mock data slug), we can't store it in MongoDB relation
            return NextResponse.json({ success: false, message: "Invalid Product ID" }, { status: 400 });
        }

        await User.findByIdAndUpdate(decoded.id, {
            $addToSet: { wishlist: productId } // Prevent duplicates
        });

        return NextResponse.json({ success: true, message: "Added to wishlist" });

    } catch (error) {
        console.error("Wishlist Add Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

// DELETE /api/wishlist - Remove item
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await verifyToken(token);

        if (!decoded || !decoded.id) {
            return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ success: false, message: "Invalid Product ID" }, { status: 400 });
        }

        await User.findByIdAndUpdate(decoded.id, {
            $pull: { wishlist: productId }
        });

        return NextResponse.json({ success: true, message: "Removed from wishlist" });

    } catch (error) {
        console.error("Wishlist Delete Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

// PUT /api/wishlist - Sync LocalStorage items
export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await verifyToken(token);

        if (!decoded || !decoded.id) {
            return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });
        }

        const body = await req.json();
        const { productIds } = body; // Array of IDs

        if (!Array.isArray(productIds)) {
            return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
        }

        // Filter valid ObjectIds
        const validIds = productIds.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validIds.length > 0) {
            await User.findByIdAndUpdate(decoded.id, {
                $addToSet: { wishlist: { $each: validIds } }
            });
        }

        return NextResponse.json({ success: true, message: "Synced successfully" });
    } catch (error) {
        console.error("Wishlist Sync Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
