import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import Question from "@/models/Question";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const { answer } = body;

        if (!answer) {
            return NextResponse.json({ success: false, message: "Answer is required" }, { status: 400 });
        }

        const question = await Question.findByIdAndUpdate(
            id,
            {
                answer,
                status: 'answered',
                answeredAt: new Date()
            },
            { new: true }
        );

        if (!question) {
            return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: question });
    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
