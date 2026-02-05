"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HeroSlider from "@/components/HeroSilder";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import CategorySidebar from "@/components/home/CategorySidebar";
import CategoryGrid from "@/components/home/CategoryGrid";
import { Product } from "@/types/product";

function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category") || "All Products";

  const setSelectedCategory = (cat: string) => {
    if (cat === "All Products") {
      router.push('/products');
    } else {
      router.push(`/products?category=${encodeURIComponent(cat)}`);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = selectedCategory === "All Products"
          ? "/api/products"
          : `/api/products?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
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
  }, [selectedCategory]);

  return (
    <div className="flex flex-col gap-0 bg-background min-h-screen">
      {/* 1. Hero Section (Only One) */}
      <div className="-mt-[88px]">
        <HeroSlider />
      </div>

      {/* 2. Visual Category Grid */}
      <CategoryGrid />

      {/* 2. Main Content Area (Sidebar + Grid) */}
      <section id="products" className="w-full max-w-[1920px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <CategorySidebar
          onCategoryChange={setSelectedCategory}
          activeCategory={selectedCategory}
        />

        {/* Product Feed */}
        <div className="flex-1 min-h-[600px]">
          <h2 className="text-3xl font-black uppercase text-foreground mb-8 flex items-center gap-4">
            {selectedCategory === "All Products" ? "Trending" : selectedCategory} <span className="text-primary">{selectedCategory === "All Products" ? "Now" : ""}</span>
            <span className="h-1 flex-1 bg-white/10 rounded-full"></span>
          </h2>

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
              <p className="text-gray-400 text-lg uppercase font-black tracking-tighter italic">No products found in this category</p>
              <button
                onClick={() => setSelectedCategory("All Products")}
                className="mt-4 text-primary font-bold uppercase tracking-widest text-xs hover:underline"
              >
                View all collections
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="bg-background min-h-screen text-foreground flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
