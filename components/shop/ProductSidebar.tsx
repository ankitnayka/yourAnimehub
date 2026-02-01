'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    count?: number;
}

export default function ProductSidebar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                if (data.success) {
                    setCategories(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <aside className="w-full">
            <div className="mb-8">
                <h3 className="font-black text-xl uppercase tracking-tighter mb-4 border-b border-gray-200 dark:border-gray-800 pb-2 text-black dark:text-white">
                    Categories
                </h3>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/products"
                            className={cn(
                                "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                !currentCategory
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#222]"
                            )}
                        >
                            All Products
                        </Link>
                    </li>
                    {categories.map((category) => (
                        <li key={category._id}>
                            <Link
                                href={`/products?category=${encodeURIComponent(category.name)}`}
                                className={cn(
                                    "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    currentCategory === category.name
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#222]"
                                )}
                            >
                                {category.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
