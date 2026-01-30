import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NavbarItem from '@/models/NavbarItem';

export async function GET() {
    try {
        await dbConnect();
        const items = await NavbarItem.find({ isActive: true }).sort({ order: 1 });
        return NextResponse.json({ success: true, data: items }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch navbar items' },
            { status: 500 }
        );
    }
}
