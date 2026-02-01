import mongoose, { Schema, model, models } from 'mongoose';

const CartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    size: {
        type: String,
        default: null
    },
    color: {
        type: String,
        default: null
    },
    slug: {
        type: String,
        required: true
    }
}, { _id: false });

const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [CartItemSchema],
    totalAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Pre-save hook to calculate total amount
CartSchema.pre('save', function () {
    this.totalAmount = this.items.reduce((total: number, item: any) => {
        return total + (item.price * item.quantity);
    }, 0);
});

// Add index for faster queries
// CartSchema.index({ userId: 1 }); // Removed to avoid duplicate index warning as userId is already unique

// Prevent Mongoose model compilation errors in development due to hot reloading
if (process.env.NODE_ENV === 'development' && models.Cart) {
    delete models.Cart;
}

const Cart = models.Cart || model('Cart', CartSchema);

export default Cart;
