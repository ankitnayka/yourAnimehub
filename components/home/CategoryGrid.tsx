"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryGrid() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                if (data.success) {
                    setCategories(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return null;
    if (categories.length === 0) return null;

    const displayedCategories = showAll ? categories : categories.slice(0, 4);
    const hasMore = categories.length > 4;

    return (
        <section className="bg-black py-12 border-b border-white/5">
            <div className="max-w-[1920px] mx-auto px-6">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-black uppercase text-white tracking-wide">
                        Shop By <span className="text-primary">Category</span>
                    </h2>
                    {hasMore && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-wider flex items-center gap-2 group outline-none"
                        >
                            {showAll ? "Show Less" : "View All"}
                            <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
                        </button>
                    )}
                </div>

                <div className={`grid grid-cols-2 md:grid-cols-3 ${showAll ? 'lg:grid-cols-6' : 'lg:grid-cols-4'} gap-4`}>
                    {displayedCategories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('category', cat.name);
                                router.push(`?${params.toString()}`, { scroll: false });

                                // Scroll to products section
                                const productsSection = document.getElementById('products');
                                if (productsSection) {
                                    productsSection.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900 border border-white/10 text-left"
                        >
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-primary/90 transition-colors duration-300" />

                            {cat.image ? (
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-600">
                                    <span className="text-4xl font-black opacity-20">{cat.name[0]}</span>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                                <h3 className="text-white font-bold uppercase tracking-wide text-lg text-center drop-shadow-md">
                                    {cat.name}
                                </h3>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
