"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    // Prevent scrolling when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-secondary border-l border-white/10 z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2">
                                <ShoppingBag size={20} /> Your Cart
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="text-white" size={24} />
                            </button>
                        </div>

                        {/* Empty State (for now) */}
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted">
                            <ShoppingBag size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-bold uppercase mb-2">Your cart is empty</p>
                            <p className="text-sm mb-6">Looks like you haven't added anything yet.</p>
                            <button
                                onClick={onClose}
                                className="bg-primary text-white font-bold uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors"
                            >
                                Conitnue Shopping
                            </button>
                        </div>

                        {/* Footer (Total & Checkout) - Hidden for empty state */}
                        {/* 
            <div className="p-6 border-t border-white/5 bg-black/20">
              <div className="flex justify-between items-center mb-4 text-white">
                <span className="font-medium text-muted">Subtotal</span>
                <span className="font-bold text-lg">₹0</span>
              </div>
              <p className="text-xs text-muted mb-4 text-center">Shipping & taxes calculated at checkout</p>
              <button className="w-full bg-white text-black font-black uppercase tracking-widest py-4 hover:bg-primary hover:text-white transition-colors">
                Checkout Now
              </button>
            </div>
            */}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
