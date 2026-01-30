import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a category name"],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Pre-save hook to generate slug from name
CategorySchema.pre("save", function () {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
});

// Prevent "OverwriteModelError" but ensure fresh model in dev for hot-reloading hooks
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.Category;
}

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
