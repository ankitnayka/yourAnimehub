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
        required: [true, "Please provide a price for this product."],
    },
    originalPrice: {
        type: Number,
    },
    image: {
        type: String,
        required: [true, "Please provide an image URL for this product."],
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
    stock: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["Active", "Out of Stock", "Archived"],
        default: "Active",
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
