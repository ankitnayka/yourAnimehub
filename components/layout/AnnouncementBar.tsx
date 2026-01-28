"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-primary text-white text-xs font-bold tracking-widest py-2 px-4 flex justify-between items-center relative z-50">
            <div className="flex-1 text-center">
                FREE SHIPPING ON ORDERS OVER ₹1799 | FREE TREASURE BAG INCLUDED
            </div>
            <button onClick={() => setIsVisible(false)} className="absolute right-4 hover:opacity-80">
                <X size={14} />
            </button>
        </div>
    );
}
