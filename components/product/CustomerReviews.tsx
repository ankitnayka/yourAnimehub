"use client";

import { useState } from "react";
import { Star, Check, SlidersHorizontal, User } from "lucide-react";
import WriteReviewModal from "./WriteReviewModal";
import api from "@/lib/api";

export interface Review {
    id: string | number;
    author: string;
    verified: boolean;
    date: string;
    rating: number;
    content: string;
    title?: string;
    photos?: string[];
    initials: string;
}

interface CustomerReviewsProps {
    reviews: Review[];
    productName: string;
    productImage: string;
    productId: string;
}

export default function CustomerReviews({ reviews, productName, productImage, productId }: CustomerReviewsProps) {
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
    const starCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => Math.round(r.rating) === star).length
    }));

    const handleSubmitReview = async (reviewData: any) => {
        try {
            console.log("Submitting review with:", { productId, ...reviewData });

            let photoUrls: string[] = [];

            // Upload photos if any
            if (reviewData.photos && reviewData.photos.length > 0) {
                // We need a way to upload. For this demo, let's assume we skip actual upload to avoid complex setup
                // unless we have a public upload endpoint. 
                // If you want real uploads, we need to implement the upload logic here.
                // For now, let's just use placeholder or base64 if small.
                // Let's TRY to send them to a new public upload endpoint I will create.

                const uploadPromises = reviewData.photos.map(async (photo: File) => {
                    const formData = new FormData();
                    formData.append('file', photo);
                    // Use a public upload route (we need to create this)
                    const res = await fetch('/api/upload/public', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();
                    return data.url;
                });

                try {
                    photoUrls = await Promise.all(uploadPromises);
                    // Filter out any failed uploads (undefined)
                    photoUrls = photoUrls.filter(url => url);
                } catch (e) {
                    console.error("Photo upload failed", e);
                    // Continue without photos or alert?
                }
            }

            const res = await api.post("/api/reviews", {
                productId: productId,
                content: reviewData.reviewText,
                rating: reviewData.rating,
                photos: photoUrls, // Send strings, not Files
                name: reviewData.name,
                email: reviewData.email
            });

            if (res.data.success) {
                alert("Review submitted successfully!");
                window.location.reload();
            } else {
                console.error("Server responded with error:", res.data);
                alert(`Failed to submit: ${res.data.message}`);
            }
        } catch (error: any) {
            console.error("Failed to submit review", error);
            alert(`Failed to submit review. ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="py-12 border-t border-gray-200 dark:border-white/10" id="reviews-section">
            <h2 className="text-2xl font-bold mb-8 text-black dark:text-white">Customer Reviews</h2>

            {/* Summary Header */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12 items-start">

                {/* Rating Number */}
                <div className="flex flex-col items-center justify-center min-w-[120px]">
                    <div className="text-6xl font-black text-black dark:text-white leading-none mb-2">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                size={20}
                                fill={averageRating >= star ? "#fbbf24" : "transparent"}
                                className={averageRating >= star ? "text-yellow-400" : "text-gray-300"}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">{reviews.length} reviews</p>
                </div>

                {/* Bars */}
                <div className="flex-1 w-full max-w-md space-y-2">
                    {starCounts.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-4 text-sm">
                            <span className="w-10 text-gray-600 dark:text-gray-400">{star} Star</span>
                            <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full"
                                    style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }}
                                />
                            </div>
                            <span className="w-6 text-right text-gray-500">{count}</span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={() => setIsWriteModalOpen(true)}
                        className="px-6 py-2 border border-black dark:border-white text-black dark:text-white font-bold uppercase text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                        Write a review
                    </button>
                    <button className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white hover:border-black dark:hover:border-white transition-colors">
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-8">
                {reviews.map(review => (
                    <div key={review.id} className="border-t border-gray-100 dark:border-gray-800 pt-8 first:border-0 first:pt-0">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-sm text-gray-600 dark:text-gray-300 flex-shrink-0">
                                {review.initials}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-black dark:text-white">{review.author}</h4>
                                    {review.verified && (
                                        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                                            <Check size={12} strokeWidth={3} />
                                            <span className="font-bold">Verified</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={14} fill={review.rating >= s ? "currentColor" : "transparent"} className={review.rating >= s ? "" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    {review.title && <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{review.title}</span>}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                    {review.content}
                                </p>

                                {review.photos && review.photos.length > 0 && (
                                    <div className="flex gap-2 mb-4">
                                        {review.photos.map((photo, i) => (
                                            <div key={i} className="w-16 h-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-90">
                                                <img src={photo} alt="Review" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="text-xs text-gray-400">
                                    {review.date}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <WriteReviewModal
                isOpen={isWriteModalOpen}
                onClose={() => setIsWriteModalOpen(false)}
                productName={productName}
                productImage={productImage}
                onSubmit={handleSubmitReview}
            />
        </div>
    );
}
