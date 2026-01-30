import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HeroSlide from '@/models/HeroSlide';

export async function GET() {
    try {
        await dbConnect();
        const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });

        return NextResponse.json({
            success: true,
            data: slides,
        });
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch hero slides' },
            { status: 500 }
        );
    }
}
