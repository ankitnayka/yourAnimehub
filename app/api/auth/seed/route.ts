import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    await dbConnect();
    try {
        const email = "admin@example.com";
        const password = "adminpassword123";

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({ message: "Admin user already exists", email });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = await User.create({
            name: "Admin User",
            email,
            password: hashedPassword,
            role: "admin",
            provider: "credentials",
            image: "https://ui-avatars.com/api/?name=Admin+User&background=random"
        });

        return NextResponse.json({
            success: true,
            message: "Admin user created successfully",
            credentials: {
                email,
                password
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
