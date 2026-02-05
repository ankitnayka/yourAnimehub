"use client";

import { motion } from "framer-motion";
import { ChevronDown, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductSidebarProps {
    onFilterChange: (filters: FilterState) => void;
    initialFilters: FilterState;
}

export interface FilterState {
    category: string;
    minPrice: string;
    maxPrice: string;
    sizes: string[];
}

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductSidebar({ onFilterChange, initialFilters }: ProductSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Local state for immediate UI updates, committed to parent on change
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [categories, setCategories] = useState<string[]>(["All Products"]);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                if (data.success) {
                    const catNames = data.data.map((c: any) => c.name);
                    setCategories(["All Products", ...catNames]);
                }
            } catch (error) {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    const updateFilter = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSizeToggle = (size: string) => {
        const currentSizes = filters.sizes;
        let newSizes;
        if (currentSizes.includes(size)) {
            newSizes = currentSizes.filter(s => s !== size);
        } else {
            newSizes = [...currentSizes, size];
        }
        updateFilter('sizes', newSizes);
    };

    const clearFilters = () => {
        const resetFilters = {
            category: "All Products",
            minPrice: "",
            maxPrice: "",
            sizes: []
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
        setIsOpen(false);
    };

    return (
        <aside className="w-full md:w-[280px] flex-shrink-0 mb-8 md:mb-0 z-20">
            <div className="md:sticky md:top-28">

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden w-full bg-[#111] text-white border border-white/20 rounded-lg px-4 py-3 flex justify-between items-center mb-4"
                >
                    <span className="font-bold flex items-center gap-2"><Filter size={18} /> Filters</span>
                    <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Sidebar Content */}
                <div className={`${isOpen ? 'block' : 'hidden'} md:block bg-white dark:bg-[#111] md:rounded-xl md:border md:border-gray-200 dark:md:border-white/10 overflow-hidden shadow-sm md:shadow-xl`}>

                    <div className="p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                        <h3 className="font-black uppercase tracking-wider">Filters</h3>
                        <button onClick={clearFilters} className="text-xs text-red-500 font-bold hover:underline">Clear All</button>
                    </div>

                    <div className="p-4 space-y-8">
                        {/* Categories */}
                        <div>
                            <h4 className="font-bold mb-3 text-sm uppercase text-gray-500 dark:text-gray-400">Category</h4>
                            <ul className="space-y-2">
                                {categories.map((cat) => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => updateFilter('category', cat)}
                                            className={`text-sm w-full text-left transition-colors font-medium flex justify-between items-center ${filters.category === cat
                                                    ? 'text-primary font-bold'
                                                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                            {filters.category === cat && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h4 className="font-bold mb-3 text-sm uppercase text-gray-500 dark:text-gray-400">Price Range (₹)</h4>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded p-2 text-sm outline-none focus:border-black dark:focus:border-white"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded p-2 text-sm outline-none focus:border-black dark:focus:border-white"
                                />
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <h4 className="font-bold mb-3 text-sm uppercase text-gray-500 dark:text-gray-400">Size</h4>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_SIZES.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeToggle(size)}
                                        className={`w-10 h-10 flex items-center justify-center border rounded text-xs font-bold transition-all ${filters.sizes.includes(size)
                                                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                                                : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-black dark:hover:border-white'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
