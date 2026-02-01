"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Product } from "@/types/product";
import WishlistButton from "@/components/ui/WishlistButton";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const { accessToken } = useAuthStore();
    const router = useRouter();

    // Calculate discount percentage
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const isOutOfStock = product.status === "Out of Stock" || (product.stock !== undefined && product.stock <= 0);

    // Check if product is already in cart
    const items = useCartStore((state) => state.items);
    const isInCart = items.some((item) => item.id === product.id || item.slug === product.slug);

    return (
        <motion.div
            className="group relative flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <img
                        src={product.image}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110' : 'scale-100'}`}
                    />
                    {product.hoverImage && (
                        <img
                            src={product.hoverImage}
                            alt={product.name}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </Link>

                {/* Badges on Image */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {product.isFeatured && (
                        <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                            Featured
                        </span>
                    )}
                    {product.isNewArrival && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                            New Arrival
                        </span>
                    )}
                    {product.badges && product.badges.length > 0 && product.badges.map((badge, idx) => (
                        <span key={idx} className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                            {badge}
                        </span>
                    ))}
                </div>
                {/* Wishlist Button */}
                <div className="absolute top-2 right-2 z-10">
                    <WishlistButton productId={product.id || product.slug} className="p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-black" />
                </div>
            </div>

            {/* Product Details */}
            <div className="p-3 flex flex-col gap-2">
                <h3 className="text-[13px] font-medium text-gray-800 line-clamp-2 min-h-[40px] leading-snug">
                    <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">{product.name}</Link>
                </h3>

                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[#B22222] font-bold text-base">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="text-gray-400 text-xs line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    {discount > 0 && (
                        <span className="bg-[#FF4D4D] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                            -{discount}% OFF
                        </span>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-1">
                    {isOutOfStock ? (
                        <button
                            disabled
                            className="w-full bg-[#EAEAEA] text-[#A0A0A0] font-bold uppercase tracking-wider py-2.5 text-[11px] rounded-md cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            SOLD OUT
                        </button>
                    ) : (
                        <button
                            onClick={async (e) => {
                                e.preventDefault(); // Prevent link navigation if inside a Link
                                if (isInCart || isAdding) {
                                    router.push('/cart');
                                    return;
                                }

                                setIsAdding(true);
                                await addItem(product, accessToken || undefined);
                                setIsAdding(false);
                            }}
                            className={`w-full font-bold uppercase tracking-wider py-2.5 text-[11px] rounded-md transition-all duration-300 flex items-center justify-center gap-2
                                ${isInCart
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gradient-to-r from-[#4A0E0E] to-[#B22222] text-white hover:from-[#3A0B0B] hover:to-[#8B1A1A] hover:shadow-lg'
                                }`}
                        >
                            {isInCart ? (
                                <>
                                    <Check size={14} /> ADDED
                                </>
                            ) : (
                                <>
                                    {isAdding ? 'ADDING...' : 'ADD TO CART'}
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
