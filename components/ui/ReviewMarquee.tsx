"use client";

import Marquee from "react-fast-marquee";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ReviewMarquee() {
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Fetch latest 10 reviews
                const res = await api.get("/api/reviews?limit=10");
                if (res.data.success) {
                    setReviews(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching reviews for marquee", error);
            }
        };
        fetchReviews();
    }, []);

    if (reviews.length === 0) return null;

    return (
        <div className="py-12 bg-gray-50 dark:bg-black/50 overflow-hidden">
            <div className="text-center mb-12 animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900 dark:text-gray-100 font-display">
                    Our customers love us
                </h2>
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 font-medium tracking-wide">
                    <span className="font-bold text-gray-900 dark:text-white">4.8 star</span>
                    <span>Based on {reviews.length}+ reviews</span>
                </div>
            </div>

            <Marquee gradient={true} gradientColor={"var(--background)" as any} speed={40} pauseOnHover={true}>
                {reviews.map((review, i) => (
                    <div
                        key={i}
                        className="mx-4 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 w-[400px] flex-shrink-0 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center font-bold text-primary text-lg flex-shrink-0">
                                {review.name.charAt(0)}
                            </div>

                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    {review.name}
                                    {review.verified && (
                                        <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</span>
                                    )}
                                </h4>
                                <div className="flex text-yellow-400 mb-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            size={14}
                                            fill={review.rating >= star ? "currentColor" : "transparent"}
                                            className={review.rating >= star ? "" : "text-gray-300 dark:text-gray-600"}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                            "{review.content}"
                        </p>
                    </div>
                ))}
            </Marquee>
        </div>
    );
}
