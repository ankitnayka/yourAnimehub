import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        select: false, // Don't return password by default
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'super-admin', 'sub-admin'],
        default: 'user',
    },
    permissions: [{
        type: String, // e.g., 'manage_products', 'manage_orders', 'view_analytics'
    }],
    provider: {
        type: String,
        enum: ['google', 'credentials'],
        required: true,
    },
    wishlist: [{
        type: String, // Storing Product IDs or Slugs
    }],
    cart: [{
        id: String,
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 },
        slug: String,
    }],
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allow multiple users to have no phone number (null/undefined)
    },
    otp: {
        code: String,
        expiresAt: Date,
    },
    addresses: [{
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String,
        isDefault: { type: Boolean, default: false }
    }],
    refreshToken: {
        type: String,
        select: false,
    },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
