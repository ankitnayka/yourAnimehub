import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const { name, email, password } = result.data;

        await dbConnect();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            provider: 'credentials',
        });

        return NextResponse.json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
