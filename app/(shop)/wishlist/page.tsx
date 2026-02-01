'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Loader2, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/orderHelpers';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function WishlistPage() {
    const { isAuthenticated, isLoading, accessToken } = useAuthStore();
    const router = useRouter();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login?redirect=/wishlist');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            setPageLoading(true);
            const { data } = await api.get('/api/user/wishlist');
            if (data.success) {
                setWishlist(data.wishlist);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist');
        } finally {
            setPageLoading(false);
        }
    };

    if (isLoading || pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-neutral-400" />
                </div>
                <h1 className="text-3xl font-bold font-oswald uppercase mb-2">Your Wishlist is Empty</h1>
                <p className="text-neutral-500 mb-8 max-w-md">
                    Seems like you don't have any saved items yet. Explore our products and save your favorites!
                </p>
                <Link href="/products" className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Breadcrumb />
            <h1 className="text-4xl font-bold font-oswald uppercase mb-8">My Wishlist ({wishlist.length})</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {wishlist.map((product) => (
                    <div key={product._id} className="group relative">
                        <div className="aspect-[3/4] overflow-hidden bg-neutral-100 mb-4 relative">
                            <Image
                                src={product.images?.[0] || '/placeholder.jpg'}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Actions could go here (remove from wishlist, add to cart) */}
                        </div>
                        <h3 className="font-bold  text-lg mb-1">{product.title}</h3>
                        <p className="text-neutral-500">{formatCurrency(product.price)}</p>

                        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10">
                            <span className="sr-only">View {product.title}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
