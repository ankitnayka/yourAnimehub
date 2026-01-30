import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

const seedProducts = [
    {
        name: "Alpha Drip Unisex Sweatshirt - Earth Brown",
        price: 899,
        originalPrice: 1999,
        image: "https://trenzicwear.com/cdn/shop/files/IMG_0488.jpg?v=1729687989&width=360",
        hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0489.jpg?v=1729687989&width=360",
        slug: "alpha-drip-sweatshirt",
        category: "Sweatshirt",
        badges: ["Best Seller"],
        stock: 50,
        status: "Active"
    },
    {
        name: "Midnight Black Oversized Tee",
        price: 599,
        originalPrice: 1299,
        image: "https://trenzicwear.com/cdn/shop/files/IMG_0461.jpg?v=1729687798&width=360",
        hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0464.jpg?v=1729687798&width=360",
        slug: "midnight-black-tee",
        category: "T-Shirt",
        badges: ["New Arrival"],
        stock: 120,
        status: "Active"
    },
    {
        name: "Urban Frost Hoodie - Steel Navy",
        price: 1999,
        originalPrice: 3499,
        image: "https://trenzicwear.com/cdn/shop/files/IMG_0531.jpg?v=1729688126&width=360",
        hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0533.jpg?v=1729688126&width=360",
        slug: "urban-frost-hoodie",
        category: "Hoodie",
        badges: ["Sale"],
        stock: 0,
        status: "Out of Stock"
    },
    {
        name: "Chaos Theory bomber Jacket",
        price: 2499,
        originalPrice: 4999,
        image: "https://trenzicwear.com/cdn/shop/files/IMG_0428.jpg?v=1729687586&width=360",
        hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0430.jpg?v=1729687586&width=360",
        slug: "chaos-theory-bomber",
        category: "Jacket",
        badges: [],
        stock: 10,
        status: "Active"
    },
    // New Anime Products
    {
        name: "Naruto Uzumaki Nine-Tails Tee",
        price: 799,
        originalPrice: 1499,
        image: "https://trenzicwear.com/cdn/shop/files/IMG_0461.jpg?v=1729687798&width=360", // Placeholder for now, user can change
        hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0464.jpg?v=1729687798&width=360",
        slug: "naruto-uzumaki-nine-tails-tee",
        category: "Anime",
        badges: ["Limited Edition"],
        stock: 100,
        status: "Active",
        description: "Unleash the power of the Nine-Tails with this premium cotton oversized tee featuring iconic Naruto artwork."
    },
    {
        name: "Attack on Titan Scout Regiment Hoodie",
        price: 2199,
        originalPrice: 3999,
        image: "https://trenzicwear.com/cdn/shop/files/IMG_0531.jpg?v=1729688126&width=360", // Placeholder
        hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0533.jpg?v=1729688126&width=360",
        slug: "aot-scout-regiment-hoodie",
        category: "Anime",
        badges: ["Best Seller"],
        stock: 75,
        status: "Active",
        description: "Join the Survey Corps with this high-quality hoodie. Features the Wings of Freedom on the back."
    }
];

export async function GET() {
    await dbConnect();
    try {
        // Clear existing products to prevent duplicates on multiple runs (optional, be careful in prod)
        // await Product.deleteMany({}); 

        // For now, let's just insert if empty or we can just append. 
        // To be safe and idempotent-ish, I'll check if any exist.
        const count = await Product.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: "Database already seeded", count });
        }

        await Product.insertMany(seedProducts);
        return NextResponse.json({ success: true, message: "Database seeded successfully", data: seedProducts });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
