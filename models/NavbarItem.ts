import mongoose from "mongoose";

const NavbarItemSchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, "Please provide a label"],
        trim: true,
    },
    path: {
        type: String,
        required: [true, "Please provide a path/URL"],
        trim: true,
    },
    isExternal: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    requiredPermission: {
        type: String, // Optional: if this link should only be visible to logged-in users with a permission? (Rare for public navbar, but good for scalability)
    }
}, { timestamps: true });

export default mongoose.models.NavbarItem || mongoose.model("NavbarItem", NavbarItemSchema);
