import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for this product."],
        maxlength: [100, "Name cannot be more than 60 characters"],
    },
    description: {
        type: String,
        required: [false, "Please provide a description for this product."],
        maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please provide a selling price for this product."],
    },
    originalPrice: {
        type: Number,
        required: [true, "Please provide an original price (MRP) for this product."],
    },
    image: {
        type: String,
        required: [true, "Please provide an image URL for this product."],
    },
    images: {
        type: [String],
        default: [],
    },
    hoverImage: {
        type: String,
    },
    category: {
        type: String,
        required: [true, "Please provide a category for this product."],
    },
    slug: {
        type: String,
        required: [true, "Please provide a slug for this product."],
        unique: true,
    },
    badges: {
        type: [String],
        default: [],
    },
    sizes: {
        type: [String],
        default: [],
    },
    variants: [
        {
            size: { type: String, required: true },
            stock: { type: Number, default: 0 }
        }
    ],
    stock: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["Active", "Out of Stock", "Archived"],
        default: "Active",
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isNewArrival: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Pre-save hook to generate slug from name
// Pre-validate hook to generate slug from name before validation
ProductSchema.pre("validate", function () {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
});

// Prevent "OverwriteModelError" but ensure fresh model in dev for hot-reloading hooks
if (process.env.NODE_ENV === "development" && mongoose.models.Product) {
    delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
