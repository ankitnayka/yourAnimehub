import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import Product from "@/models/Product"; // Ensure Product model is initialized

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { productId, rating, content, photos, name, email } = body;

        if (!productId || !rating || !content || !name || !email) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Optional: Check if user already reviewed this product?
        // For now, allow multiple reviews or assume frontend handles checks based on auth or local storage limits.

        const newReview = await Review.create({
            product: productId,
            rating,
            content,
            photos: photos || [],
            name,
            email,
            verified: false // You might want to logic to set this true if email matches a purchase
        });

        return NextResponse.json({ success: true, data: newReview });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");
        const limit = parseInt(searchParams.get("limit") || "0");

        let query = {};
        if (productId) {
            query = { product: productId };
        }

        let reviewsQuery = Review.find(query).sort({ createdAt: -1 });

        if (limit > 0) {
            reviewsQuery = reviewsQuery.limit(limit);
        }

        const reviews = await reviewsQuery.populate("product", "name"); // Populate product name if needed

        return NextResponse.json({ success: true, data: reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
