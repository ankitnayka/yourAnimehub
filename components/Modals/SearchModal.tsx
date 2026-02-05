"use client";

import React, { useState, useEffect, ChangeEvent, JSX } from "react";
import { X, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

/* ----------------------------------------
   ✅ Types
---------------------------------------- */

type Product = {
  _id: string; // Updated to match MongoDB _id
  id?: string;
  name: string;
  price: number; // Updated to number
  image: string; // Main image
  images: string[]; // Updated to array of strings
  slug: string;
};

type SearchModalProps = {
  close: () => void;
};

/* ----------------------------------------
   ✅ Component
---------------------------------------- */

export default function SearchModal({
  close,
}: SearchModalProps): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Debounce logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        fetchProducts();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/products?search=${query}`);
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------
     ✅ Highlight Function
  ---------------------------------------- */

  const highlightText = (text: string): React.ReactNode => {
    if (!query) return text;

    const regex: RegExp = new RegExp(`(${query})`, "gi");
    const parts: string[] = text.split(regex);

    return parts.map((part: string, index: number) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 font-semibold text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  /* ----------------------------------------
     ✅ Input Change Handler
  ---------------------------------------- */

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`);
    close();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Box */}
      <div className="absolute top-0 left-0 w-full bg-neutral-900 border-b border-neutral-800 shadow-2xl">

        {/* Search Input */}
        <div className="max-w-4xl mx-auto flex items-center px-6 py-6">
          <Search className="w-6 h-6 text-neutral-400 mr-4" />
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={handleChange}
            autoFocus
            className="w-full bg-transparent outline-none text-2xl text-white placeholder:text-neutral-600 font-medium"
          />
          {/* Close Button */}
          <button
            onClick={close}
            type="button"
            className="ml-4 p-2 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-neutral-400 hover:text-white" />
          </button>
        </div>

        {/* Results Area */}
        {query && (
          <div className="max-w-4xl mx-auto pb-8 px-6">
            <div className="border-t border-neutral-800 pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product.slug)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-800/50 cursor-pointer transition-all group border border-transparent hover:border-neutral-700"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                        <img
                          src={product.images?.[0] || product.image || "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h4 className="text-neutral-200 font-medium group-hover:text-white transition-colors line-clamp-1">
                          {highlightText(product.name)}
                        </h4>
                        <p className="text-red-500 font-bold mt-1">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <p>No products found for "{query}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
