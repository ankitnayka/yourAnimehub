"use client"

import React from 'react';
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductSidebar, { FilterState } from "@/components/shop/ProductSidebar";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { Product } from "@/types/product";

function ProductsContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Parse URL params
    const category = searchParams.get("category") || "All Products";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const sizes = searchParams.get("sizes") ? searchParams.get("sizes")!.split(",") : [];
    const isNew = searchParams.get("new") === "true";
    const isFeatured = searchParams.get("featured") === "true";
    const sort = searchParams.get("sort") || "newest";

    const handleFilterChange = (filters: FilterState) => {
        const params = new URLSearchParams(searchParams.toString());

        // Category
        if (filters.category === "All Products") params.delete("category");
        else params.set("category", filters.category);

        // Price
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        else params.delete("minPrice");

        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        else params.delete("maxPrice");

        // Sizes
        if (filters.sizes.length > 0) params.set("sizes", filters.sizes.join(","));
        else params.delete("sizes");

        // Reset pagination if implemented, keep sort/new/featured if not explicitly cleared?
        // Usually clicking a category or filter retains sort.

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (category !== "All Products") params.set("category", category);
                if (minPrice) params.set("minPrice", minPrice);
                if (maxPrice) params.set("maxPrice", maxPrice);
                if (sizes.length > 0) params.set("sizes", sizes.join(","));
                if (isNew) params.set("new", "true");
                if (isFeatured) params.set("featured", "true");
                if (sort) params.set("sort", sort);

                const res = await fetch(`/api/products?${params.toString()}`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, minPrice, maxPrice, sizes.join(','), isNew, isFeatured, sort]);

    return (
        <div className="bg-background min-h-screen">
            {/* Header Section */}
            <div className="bg-[#111] py-12 px-6 border-b border-white/10">
                <div className="max-w-[1920px] mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                        {isNew ? "New Arrivals" : isFeatured ? "Featured Products" : category}
                    </h1>
                    <p className="text-gray-400">
                        Explore our exclusive collection of anime-inspired fashion and accessories.
                    </p>
                </div>
            </div>

            {/* Main Content Area (Sidebar + Grid) */}
            <section id="products" className="w-full max-w-[1920px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <ProductSidebar
                    onFilterChange={handleFilterChange}
                    initialFilters={{
                        category,
                        minPrice,
                        maxPrice,
                        sizes
                    }}
                />

                {/* Product Feed */}
                <div className="flex-1 min-h-[600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className="text-3xl font-black uppercase text-foreground flex items-center gap-4">
                            Products <span className="h-1 w-20 bg-primary/20 rounded-full"></span>
                        </h2>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold uppercase text-gray-500">Sort By:</span>
                            <select
                                value={sort}
                                onChange={handleSortChange}
                                className="bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm font-bold focus:outline-none text-black dark:text-white"
                            >
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price Low to High</option>
                                <option value="price_desc">Price High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl mt-8">
                            <p className="text-gray-400 text-lg uppercase font-black tracking-tighter italic">No products found matching filters</p>
                            <button
                                onClick={() => router.push('/products')}
                                className="mt-4 text-primary font-bold uppercase tracking-widest text-xs hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="bg-background min-h-screen text-foreground flex items-center justify-center">Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
