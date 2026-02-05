"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, updateQuantity, removeItem, fetchCart, syncCart } = useCartStore();
    const { isAuthenticated, accessToken } = useAuthStore();

    // Prevent scrolling when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    // Initial fetch from backend if logged in
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchCart(accessToken);
        }
    }, [isAuthenticated, accessToken]);

    // Sync to backend on any change if logged in
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            const timer = setTimeout(() => {
                syncCart(accessToken);
            }, 1000); // Debounce sync
            return () => clearTimeout(timer);
        }
    }, [items, isAuthenticated, accessToken]);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
                        className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-background dark:bg-secondary border-l border-border dark:border-white/10 z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border dark:border-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                <ShoppingBag size={20} /> Your Cart <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{items.length}</span>
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="text-foreground" size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                                    <ShoppingBag size={48} className="mb-4 opacity-50" />
                                    <p className="text-lg font-bold uppercase mb-2 text-foreground">Your cart is empty</p>
                                    <p className="text-sm mb-6 max-w-[200px] mx-auto">Looks like you haven't added anything yet.</p>
                                    <button
                                        onClick={onClose}
                                        className="bg-primary text-white font-bold uppercase tracking-widest px-8 py-3 hover:bg-red-600 transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 group bg-white dark:bg-black/10 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
                                            <div className="w-20 h-24 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-[13px] font-bold text-foreground uppercase line-clamp-1 tracking-tight mb-1">{item.name}</h3>
                                                        <p className="text-xs text-muted-foreground mb-2">Price: ₹{item.price.toLocaleString()}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors -mt-1 -mr-1 p-1"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center border border-gray-200 dark:border-white/10 rounded bg-gray-50 dark:bg-black/20">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1 px-2.5 hover:bg-black/5 dark:hover:bg-white/10 text-foreground transition-colors border-r border-gray-200 dark:border-white/10"
                                                        >
                                                            <Minus size={10} />
                                                        </button>
                                                        <span className="text-xs font-black text-foreground px-2 w-8 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1 px-2.5 hover:bg-black/5 dark:hover:bg-white/10 text-foreground transition-colors border-l border-gray-200 dark:border-white/10"
                                                        >
                                                            <Plus size={10} />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">Total</p>
                                                        <p className="text-[#B22222] font-black text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-border dark:border-white/10 bg-background/80 dark:bg-black/40 backdrop-blur-md">
                                <div className="flex justify-between items-center mb-1 text-foreground">
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
                                    <span className="font-black text-2xl tracking-tighter">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <p className="text-[9px] text-muted-foreground mb-6 uppercase tracking-[0.2em] text-center italic">Shipping & taxes calculated at checkout</p>
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="group relative block w-full bg-foreground text-background dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] py-5 text-xs text-center transition-all hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white"
                                >
                                    Proceed to Checkout
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
