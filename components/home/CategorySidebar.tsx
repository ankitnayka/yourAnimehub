"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const categories = [
    "All Products",
    "Straight Fit Pyjama",
    "Acidwash (T-shirt)",
    "Baggy Trousers (Printed)",
    "Hoodies",
    "Jacket",
    "Pull Over",
    "Sweatshirt",
    "Oversized T-Shirt",
    "Co-ord set",
    "Acid Wash Hoodies",
    "Tanks"
];

export default function CategorySidebar() {
    return (
        <aside className="w-full md:w-[280px] flex-shrink-0">
            <div className="bg-gradient-to-b from-[#2A0A0A] to-[#1a0505] rounded-xl border border-white/5 overflow-hidden shadow-2xl p-4 md:sticky md:top-24">
                <h3 className="text-xl font-black uppercase text-white mb-6 pl-2 tracking-wide border-b border-white/10 pb-4">
                    Browse Collections
                </h3>

                <ul className="flex flex-col gap-2">
                    {categories.map((cat, idx) => (
                        <motion.li
                            key={cat}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <button className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide flex justify-between items-center transition-all duration-200 ${idx === 0 ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                {cat}
                                {idx === 0 && <span className="w-2 h-2 rounded-full bg-primary" />}
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
