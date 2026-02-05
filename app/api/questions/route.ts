import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Question from "@/models/Question";
import Product from "@/models/Product";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { productId, name, email, mobile, message } = body;

        if (!productId || !name || !email || !message) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const newQuestion = await Question.create({
            product: productId,
            name,
            email,
            mobile,
            message,
        });

        return NextResponse.json({ success: true, data: newQuestion });
    } catch (error) {
        console.error("Error creating question:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Ensure Product model is registered
        if (!Product) {
            // Just to ensure import dependency if needed, though ConnectToDB usually handles connection
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        let query = {};
        if (productId) {
            query = { product: productId };
        }

        const questions = await Question.find(query).populate("product", "name image images slug").sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: questions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
