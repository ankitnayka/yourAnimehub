"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface CategorySidebarProps {
    onCategoryChange?: (category: string) => void;
    activeCategory?: string;
}

export default function CategorySidebar({ onCategoryChange, activeCategory = "All Products" }: CategorySidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(activeCategory);
    const [categories, setCategories] = useState<string[]>(["All Products"]);

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

    useEffect(() => {
        setSelectedCategory(activeCategory);
    }, [activeCategory]);

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat);
        setIsOpen(false);
        if (onCategoryChange) {
            onCategoryChange(cat);
        }
    };

    return (
        <aside className="w-full md:w-[280px] flex-shrink-0 mb-8 md:mb-0">
            <div className={`md:bg-gradient-to-b md:from-[#2A0A0A] md:to-[#1a0505] md:rounded-xl md:border md:border-white/5 md:overflow-hidden md:shadow-2xl md:sticky md:top-28`}>

                {/* Mobile: Title + Dropdown Button */}
                <div className="md:hidden flex flex-col gap-2">
                    <h3 className="text-xl font-black uppercase text-white tracking-wide pl-1">
                        Browse Collections
                    </h3>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full bg-white border-2 border-orange-500 rounded-lg px-4 py-3 flex justify-between items-center group"
                    >
                        <span className="text-black font-bold uppercase tracking-wide text-sm">
                            {selectedCategory}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-black transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Desktop Title */}
                <h3 className="hidden md:block text-xl font-black uppercase text-white mb-6 p-4 pl-6 tracking-wide border-b border-white/10 pb-4">
                    Browse Collections
                </h3>

                {/* Content List */}
                <div className={`${isOpen ? 'block' : 'hidden'} md:block mt-2 md:mt-0 px-0 md:px-4 md:pb-4`}>
                    <motion.ul
                        className="flex flex-col gap-2 bg-neutral-900/95 md:bg-transparent rounded-lg border border-white/10 md:border-none p-2 md:p-0"
                        initial={false}
                        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    >
                        {categories.map((cat, idx) => (
                            <motion.li
                                key={cat}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <button
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide flex justify-between items-center transition-all duration-200 
                                    ${selectedCategory === cat
                                            ? 'bg-primary text-white md:bg-white md:text-black'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {cat}
                                    {selectedCategory === cat && <span className="w-2 h-2 rounded-full bg-white md:bg-primary" />}
                                </button>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </div>
        </aside>
    );
}
