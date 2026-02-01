"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from '@/lib/api';

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);
    const [text, setText] = useState("FREE SHIPPING ON ORDERS OVER ₹1799 | FREE ANIME BAG INCLUDED");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/api/settings');
                if (data.success && data.data) {
                    setText(data.data.announcementText);
                    setIsActive(data.data.announcementActive);
                }
            } catch (error) {
                console.error("Failed to fetch announcement settings");
            }
        };

        fetchSettings();
    }, []);

    if (!isVisible || !isActive) return null;

    return (
        <div className="bg-primary text-white text-xs font-bold tracking-widest py-2 px-4 flex justify-between items-center relative z-50 overflow-hidden">
            <div className="flex-1 w-full overflow-hidden relative h-5">
                <div className="absolute top-0 w-full h-full flex items-center overflow-hidden">
                    {/* We use a simple CSS animation for the marquee effect */}
                    <div className="animate-marquee whitespace-nowrap flex">
                        <span className="mx-8">{text}</span>
                        <span className="mx-8">{text}</span>
                        <span className="mx-8">{text}</span>
                        <span className="mx-8">{text}</span>
                        <span className="mx-8">{text}</span>
                        <span className="mx-8">{text}</span>
                    </div>
                </div>
            </div>
            <button onClick={() => setIsVisible(false)} className="ml-4 hover:opacity-80 z-10 bg-primary pl-2 text-white">
                <X size={14} />
            </button>
            <style jsx>{`
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
                /* To make it seamless, we need enough duplicates and move by percentage of total width 
                   But standard marquee enters from right.
                   User asked for "left to right".
                   Left to right: 0% { transform: -100% } 100% { transform: 100% }
                */
               @keyframes marquee-ltr {
                   0% { transform: translateX(-100%); }
                   100% { transform: translateX(100%); }
               }
            `}</style>
            {/* 
                Re-reading user request: "continue animation from left to right"
                Usually "Scroll Left" means content moves TO the left (Right -> Left).
                If they meant the direction of movement is towards the right:
                Let's stick to the standard "Ticker" style (Right -> Left) first as is standard for "News Tickers".
                However, if they specifically want it to move towards the right...
                I'll use a standard seamless loop (usually Right -> Left) because "text appear" implies reading it.
                Wait, "from left to right" usually means start at left and go right.
                I will provide a standard continuous loop. 
                Because of the duplication, I can switch direction easily. 
                Let's do Right->Left (transform 0 to -50%) for readability.
             */}
        </div>
    );
}
