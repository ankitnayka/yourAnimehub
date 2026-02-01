"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";

interface WishlistButtonProps {
    productId: string;
    className?: string;
    iconSize?: number;
}

export default function WishlistButton({ productId, className = "", iconSize = 20 }: WishlistButtonProps) {
    const { isInWishlist, addItem, removeItem } = useWishlistStore();
    const { accessToken } = useAuthStore();
    const [isActive, setIsActive] = useState(false);

    // Sync local state with store
    const inList = isInWishlist(productId);

    useEffect(() => {
        setIsActive(inList);
    }, [inList]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isActive) {
            await removeItem(productId, accessToken || undefined);
            // Toast functionality would go here
            showToast("Removed from wishlist");
        } else {
            await addItem(productId, accessToken || undefined);
            // Toast functionality would go here
            showToast("Added to wishlist ❤️");
        }
        // setIsActive(!isActive); // Store updates will trigger useEffect, but instant feedback is nice.
    };

    // Simple toast helper (could be moved to a global context)
    const showToast = (msg: string) => {
        const toast = document.createElement("div");
        toast.className = "fixed bottom-5 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md shadow-lg z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300 font-bold text-sm flex items-center gap-2";
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("opacity-0", "transition-opacity");
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    };

    return (
        <button
            onClick={handleToggle}
            className={`transition-all duration-300 transform active:scale-90 hover:scale-110 ${className}`}
            aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                size={iconSize}
                className={`transition-colors duration-300 ${isActive ? "fill-red-600 text-red-600" : "text-gray-400 dark:text-gray-200"}`}
            />
        </button>
    );
}
