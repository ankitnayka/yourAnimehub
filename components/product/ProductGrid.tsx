"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
    title: string;
    products: Product[];
}

export default function ProductGrid({ title, products }: ProductGridProps) {
    return (
        <section className="py-20 px-6 max-w-[1920px] mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16 uppercase tracking-tighter text-outline-white">
                {title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
