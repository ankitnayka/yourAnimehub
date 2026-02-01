'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useRouter } from 'next/navigation';
import { Loader2, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/orderHelpers';
import Breadcrumb from '@/components/ui/Breadcrumb';
import WishlistButton from '@/components/ui/WishlistButton';

export default function WishlistPage() {
    const { isAuthenticated, isLoading, accessToken } = useAuthStore();
    const { fetchWishlist, fullItems, isLoading: wishlistLoading } = useWishlistStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login?redirect=/wishlist');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchWishlist(accessToken);
        }
    }, [isAuthenticated, accessToken, fetchWishlist]);

    if (isLoading || wishlistLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (fullItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-background">
                <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-neutral-400" />
                </div>
                <h1 className="text-3xl font-black text-foreground font-display uppercase mb-2">Your Wishlist is Empty</h1>
                <p className="text-neutral-500 mb-8 max-w-md">
                    Seems like you don't have any saved items yet. Explore our products and save your favorites!
                </p>
                <Link href="/" className="bg-primary text-white px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-red-600 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 bg-background min-h-screen">
            <Breadcrumb />
            <h1 className="text-4xl font-black text-foreground font-display uppercase mb-8">My Wishlist ({fullItems.length})</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {fullItems.map((product) => (
                    <div key={product._id} className="group relative bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-[#27272a] relative">
                            {/* Image with fallback */}
                            {product.image ? (
                                <Image
                                    src={product.image} // Using 'image' from Product model, not 'images' array (Product model has 'image' string field, but page previously used array. Product model has 'image', 'hoverImage')
                                    // Wait, Product model says: image: { type: String }. The previous page code used product.images[0]. 
                                    // Let's check ProductCard.tsx again. It uses product.image.
                                    // But the mock data in [slug]/page.tsx used images array.
                                    // The REAL Product model (models/Product.ts) has 'image' as a string.
                                    // So we uses `product.image`.
                                    alt={product.name || 'Product Image'} // using 'name'
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}

                            {/* Wishlist Button (Remove action) */}
                            <div className="absolute top-2 right-2 z-10">
                                <WishlistButton productId={product._id} className="p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-black" />
                            </div>
                        </div>

                        <div className="p-3">
                            <h3 className="text-[13px] font-medium text-foreground line-clamp-2 min-h-[40px] leading-snug mb-2">
                                <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                                    {product.name}
                                </Link>
                            </h3>

                            <div className="flex items-center gap-2">
                                <span className="text-[#B22222] font-bold text-base">{formatCurrency(product.price)}</span>
                                {product.originalPrice && (
                                    <span className="text-gray-400 text-xs line-through">{formatCurrency(product.originalPrice)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
