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
    },
    socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
        youtube: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    },
    contactInfo: {
        address: { type: String, default: 'Samodiya Faliya,opp,Agricuture College,Navsari,Gujarat,India' },
        phone: { type: String, default: '+91 9664594451' },
        email: { type: String, default: 'ankit@gmail.com' }
    }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
