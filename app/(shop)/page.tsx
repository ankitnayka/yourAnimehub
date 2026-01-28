"use client";

import HeroSlider from "@/components/HeroSilder";
// Direct import of ProductCard to avoid circular/missing export issues from ProductGrid
import ProductCard from "@/components/product/ProductCard";
import CategorySidebar from "@/components/home/CategorySidebar";
import { Product } from "@/types/product";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Alpha Drip Unisex Sweatshirt - Earth Brown",
    price: 899,
    originalPrice: 1999,
    image: "https://trenzicwear.com/cdn/shop/files/IMG_0488.jpg?v=1729687989&width=360",
    hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0489.jpg?v=1729687989&width=360",
    slug: "alpha-drip-sweatshirt",
    category: "Sweatshirt",
    badges: ["Best Seller"]
  },
  {
    id: "2",
    name: "Midnight Black Oversized Tee",
    price: 599,
    originalPrice: 1299,
    image: "https://trenzicwear.com/cdn/shop/files/IMG_0461.jpg?v=1729687798&width=360",
    hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0464.jpg?v=1729687798&width=360",
    slug: "midnight-black-tee",
    category: "T-Shirt",
    badges: ["New Arrival"]
  },
  {
    id: "3",
    name: "Urban Frost Hoodie - Steel Navy",
    price: 1999,
    originalPrice: 3499,
    image: "https://trenzicwear.com/cdn/shop/files/IMG_0531.jpg?v=1729688126&width=360",
    hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0533.jpg?v=1729688126&width=360",
    slug: "urban-frost-hoodie",
    category: "Hoodie",
    badges: ["Sale"]
  },
  {
    id: "4",
    name: "Chaos Theory bomber Jacket",
    price: 2499,
    originalPrice: 4999,
    image: "https://trenzicwear.com/cdn/shop/files/IMG_0428.jpg?v=1729687586&width=360",
    hoverImage: "https://trenzicwear.com/cdn/shop/files/IMG_0430.jpg?v=1729687586&width=360",
    slug: "chaos-theory-bomber",
    category: "Jacket",
    badges: []
  }
];

export default function Home() {
  return (
    <div className="flex flex-col gap-0 bg-black min-h-screen">
      {/* 1. Hero Section (Only One) */}
      <div className="-mt-[88px]">
        <HeroSlider />
      </div>

      {/* 2. Main Content Area (Sidebar + Grid) */}
      <section className="max-w-[1920px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <CategorySidebar />

        {/* Product Feed */}
        <div className="flex-1">
          <h2 className="text-3xl font-black uppercase text-white mb-8 flex items-center gap-4">
            Trending <span className="text-primary">Now</span>
            <span className="h-1 flex-1 bg-white/10 rounded-full"></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {mockProducts.map((product) => (
              <ProductCard key={product.id + '_dup'} product={product} /> // Duplicated for demo fullness
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
