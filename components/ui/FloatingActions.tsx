"use client";

import { useState, useEffect } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingActionsProps {
    whatsappNumber?: string;
}

export default function FloatingActions({ whatsappNumber }: FloatingActionsProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const openWhatsApp = () => {
        // Default number if provided one is empty or invalid
        const number = whatsappNumber || "919876543210";
        // Clean the number
        const cleanNumber = number.replace(/\D/g, '');
        const url = `https://wa.me/${cleanNumber}?text=Hi,%20I'd%20like%20to%20place%20an%20order.`;
        window.open(url, "_blank");
    };

    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40 items-center">
            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        onClick={scrollToTop}
                        className="p-3 bg-white dark:bg-black border border-gray-200 dark:border-white/20 rounded-full shadow-lg text-black dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>

            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={openWhatsApp}
                className="p-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 relative group"
                aria-label="Chat on WhatsApp"
            >
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat with us
                </span>
                <MessageCircle className="w-6 h-6 fill-current" />
            </motion.button>
        </div>
    );
}
