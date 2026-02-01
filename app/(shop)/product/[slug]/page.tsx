"use client";

import { useState } from "react";
import { Star, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    const router = useRouter();
    const { addItem } = useCartStore();
    const { accessToken } = useAuthStore();

    // Mock Data (replace with real fetch later)
    const product = {
        name: "Alpha Drip Unisex Sweatshirt - Earth Brown (Raw Nature)",
        price: 899,
        originalPrice: 1999,
        description: "Embrace the raw power of nature with the Alpha Drip Sweatshirt. Featuring premium cotton blend fabric, oversized fit for maximum comfort, and a unique anime-inspired print that stands out.",
        images: [
            "https://trenzicwear.com/cdn/shop/files/IMG_0488.jpg?v=1729687989&width=720",
            "https://trenzicwear.com/cdn/shop/files/IMG_0489.jpg?v=1729687989&width=720",
            "https://trenzicwear.com/cdn/shop/files/IMG_0490.jpg?v=1729687989&width=720"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    };

    const handleAddToCart = async () => {
        try {
            setIsAdding(true);

            // Construct product object for cart
            // In a real app, you'd fetch the ID from the backend or pass it in props
            const cartItem = {
                id: params.slug, // Using slug as ID for this mock
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.images[0],
                slug: params.slug,
                category: "Unisex",
                quantity: quantity,
                size: selectedSize, // Include selected size
            } as any;

            await addItem(cartItem, accessToken || undefined);

            // Small delay to show "Added" state then redirect
            setTimeout(() => {
                router.push('/cart');
            }, 600);
        } catch (error) {
            console.error("Add to cart failed", error);
            setIsAdding(false);
            // Optionally show toast/alert
        }
    };

    return (
        <div className="pt-24 pb-20 max-w-[1600px] mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row gap-12">

                {/* Gallery Section */}
                <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <div className="flex md:flex-col order-2 md:order-1 gap-4 overflow-x-auto md:overflow-y-auto md:h-[600px] scrollbar-hide">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`flex-shrink-0 w-20 h-24 md:w-24 md:h-32 border-2 ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}
                            >
                                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 order-1 md:order-2 h-[500px] md:h-[700px] overflow-hidden rounded-sm relative bg-secondary">
                        <img src={product.images[activeImage]} alt="Main" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 lg:max-w-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="text-sm text-gray-400"> (42 Reviews)</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4 leading-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-end gap-3 mb-8">
                        <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                        <span className="text-xl text-gray-500 line-through mb-1">₹{product.originalPrice}</span>
                        <span className="text-xs bg-white text-black font-bold px-2 py-1 mb-1 rounded-sm">SAVE 55%</span>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold uppercase text-gray-400">Select Size</label>
                            <button className="text-sm text-white underline">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-12 flex items-center justify-center font-bold border transition-all ${selectedSize === size ? 'bg-white text-black border-white' : 'bg-transparent text-white border-gray-700 hover:border-gray-500'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8 p-4 bg-secondary/50 border border-white/5 rounded-lg">
                        <p className="text-sm text-gray-300 leading-relaxed font-light">{product.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 sticky bottom-0 bg-black/90 p-4 md:static md:bg-transparent md:p-0 backdrop-blur-md md:backdrop-blur-none border-t border-white/10 md:border-none z-40">
                        <div className="flex gap-4">
                            <div className="flex items-center border border-gray-700 h-14 w-32 justify-between px-4">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-primary"><Minus size={18} /></button>
                                <span className="font-bold text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="hover:text-primary"><Plus size={18} /></button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`flex-1 font-black uppercase tracking-widest h-14 transition-all flex items-center justify-center gap-2 text-lg
                                    ${isAdding
                                        ? 'bg-green-600 text-white'
                                        : 'bg-primary text-white hover:bg-white hover:text-black'
                                    }`}
                            >
                                {isAdding ? (
                                    <>
                                        <Check size={20} /> Added
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} /> Add to Cart
                                    </>
                                )}
                            </button>
                        </div>
                        <button className="w-full bg-green-600 text-white font-bold uppercase h-12 tracking-wide hover:bg-green-500 transition-colors flex items-center justify-center gap-2">
                            Order on WhatsApp
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-gray-500 border-t border-white/10 pt-6">
                        <div className="flex items-center gap-2">
                            <span>🚚 Free Shipping on orders over ₹1799</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>🔒 Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>↩️ 7 Days Easy Return</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>👕 Premium Quality Fabric</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
