import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        default: 'image',
    },
    mediaUrl: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: '#',
    },
    cta: {
        type: String,
        default: 'Shop Now',
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export default mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);
