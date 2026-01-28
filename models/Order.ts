import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String
    },
    paymentMethod: {
        type: String,
        default: 'COD'
    }
}, { timestamps: true });

const Order = models.Order || model('Order', OrderSchema);

export default Order;
