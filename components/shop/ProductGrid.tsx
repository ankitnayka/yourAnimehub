'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface Product {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    hoverImage?: string;
    slug: string;
    category: string;
    isNewArrival?: boolean;
    isFeatured?: boolean;
}

export default function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = category
                    ? `/api/products?category=${encodeURIComponent(category)}`
                    : '/api/products';

                const res = await fetch(url);
                const data = await res.json();

                if (data.success) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault(); // Prevent navigation if clicked on card
        addItem({
            id: product._id,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.image || '/placeholder.png',
            quantity: 1,
            slug: product.slug,
        } as any);
    };

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                <p className="text-lg">No products found.</p>
                <button
                    onClick={() => window.location.href = '/products'}
                    className="mt-4 text-primary underline"
                >
                    Clear filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    className="group block bg-white dark:bg-[#111] rounded-xl overflow-hidden border border-gray-200 dark:border-[#222] hover:border-black dark:hover:border-white transition-all duration-300"
                >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-[#222]">
                        <img
                            src={product.image || '/placeholder.png'}
                            alt={product.name}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.isNewArrival && (
                                <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                    New
                                </span>
                            )}
                            {product.salePrice && (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                    Sale
                                </span>
                            )}
                        </div>

                        {/* Quick Add Button */}
                        <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white z-10"
                            title="Add to Cart"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                        <h3 className="font-bold text-black dark:text-white truncate mb-1">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            {product.salePrice ? (
                                <>
                                    <span className="text-red-600 font-bold">
                                        ₹{product.salePrice}
                                    </span>
                                    <span className="text-gray-400 text-sm line-through">
                                        ₹{product.price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-black dark:text-white font-bold">
                                    ₹{product.price}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
