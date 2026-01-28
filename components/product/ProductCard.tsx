"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate discount percentage
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <motion.div
            className="group relative flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-sm mb-4">
                {/* Badges */}
                <div className="absolute top-2 left-2 z-20 flex flex-col gap-2">
                    {discount > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                            -{discount}%
                        </span>
                    )}
                    {product.badges?.map((badge, idx) => (
                        <span key={idx} className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                            {badge}
                        </span>
                    ))}
                </div>

                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <img
                        src={product.image}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && product.hoverImage ? 'opacity-0' : 'opacity-100'}`}
                    />
                    {product.hoverImage && (
                        <img
                            src={product.hoverImage}
                            alt={product.name}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </Link>

                {/* Quick Action Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 ease-out z-20 ${isHovered ? 'translate-y-0' : ''}`}>
                    <button className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 text-xs hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                        <ShoppingCart size={14} /> Add To Cart
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold uppercase tracking-wide text-white truncate max-w-full">
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className="text-muted text-xs line-through">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
