import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    announcementText: {
        type: String,
        required: true,
        default: 'FREE SHIPPING ON ORDERS OVER ₹1799 | FREE TREASURE BAG INCLUDED'
    },
    announcementActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
