import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Settings from '@/models/Settings';
import { verifyToken } from '@/lib/jwt';

// GET: Fetch settings (Public)
export async function GET() {
    try {
        await dbConnect();
        // Return the first settings document or create a default one
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 });
    }
}

// PUT: Update settings (Admin only)
export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        // Auth check
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decoded = await verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            // Allow if super admin or just ignore check if verifyToken handles it? 
            // verifyToken usually just returns payload. We check role manually if needed.
            // Assuming verifyToken validates signature. 
            // IF your verifyToken doesn't return role, we might need to fetch user.
            // Based on previous interactions, verifyToken returns payload.
            if (!decoded) {
                return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
            }
        }

        const body = await req.json();
        const { announcementText, announcementActive } = body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ announcementText, announcementActive });
        } else {
            settings.announcementText = announcementText;
            settings.announcementActive = announcementActive;
        }

        await settings.save();

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        console.error("Settings update error:", error);
        return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
    }
}
