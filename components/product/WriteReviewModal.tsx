import { useState, useRef } from "react";
import { X, Star, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productImage: string;
    onSubmit: (review: any) => void;
}

export default function WriteReviewModal({ isOpen, onClose, productName, productImage, onSubmit }: WriteReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [photos, setPhotos] = useState<File[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPhotos = Array.from(e.target.files);
            if (photos.length + newPhotos.length <= 5) {
                setPhotos([...photos, ...newPhotos]);
            } else {
                alert("You can only upload up to 5 photos.");
            }
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            rating,
            reviewText,
            photos,
            name,
            email
        });
        // Reset and close
        setRating(0);
        setReviewText("");
        setPhotos([]);
        setName("");
        setEmail("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white dark:bg-[#111] w-full max-w-lg rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-black dark:text-white">Write a review</h2>
                            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <X className="text-gray-500 dark:text-gray-400" size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 space-y-6">
                            {/* Product Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-20 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                    <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">{productName}</h3>
                            </div>

                            {/* Rating */}
                            <div>
                                <h4 className="font-bold text-black dark:text-white mb-2">Rating</h4>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={28}
                                                fill={(hoverRating || rating) >= star ? "#fbbf24" : "transparent"}
                                                className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Text */}
                            <div>
                                <h4 className="font-bold text-black dark:text-white mb-2">Review</h4>
                                <div className="relative">
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Share your feedback with us now"
                                        className="w-full h-32 p-3 border border-gray-300 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent text-black dark:text-white placeholder:text-gray-400"
                                        maxLength={2000}
                                    />
                                    <span className="absolute bottom-2 right-2 text-xs text-gray-400">{reviewText.length}/2000</span>
                                </div>
                            </div>

                            {/* Photos */}
                            <div>
                                <h4 className="font-bold text-black dark:text-white mb-2">Add photo</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors bg-gray-50 dark:bg-gray-800/50"
                                    >
                                        <div className="mb-1"><img src="/placeholder-icon.png" className="hidden" alt="" /><Upload size={20} /></div>
                                        <span className="text-[10px] font-bold">Add photo</span>
                                        <span className="text-[10px]">{photos.length}/5</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                    />
                                    {photos.map((photo, index) => (
                                        <div key={index} className="w-20 h-20 relative rounded-lg overflow-hidden group">
                                            <img src={URL.createObjectURL(photo)} alt="preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Name & Email */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-black dark:text-white mb-2">Your name</h4>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent text-black dark:text-white"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-black dark:text-white mb-2">Your email</h4>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent text-black dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Legal */}
                            <p className="text-xs text-center text-gray-500">
                                By submitting this review, you agree to Trustoo.io's <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms</a> regarding the processing of your personal data.
                            </p>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gray-400 hover:bg-black text-white font-bold py-3 rounded-lg transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!rating || !reviewText || !name || !email}
                            >
                                Submit review
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
