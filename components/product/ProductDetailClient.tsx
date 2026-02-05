"use client";

import { useState, use, useEffect, useRef } from "react";
import { Star, Minus, Plus, ShoppingCart, Check, Truck, Shield, RotateCcw, Shirt, Loader2, ChevronUp, ChevronDown, X, Copy, Share2, MessageCircle, Mail, Phone, User as UserIcon } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import WishlistButton from "@/components/ui/WishlistButton";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import CustomerReviews, { Review } from "@/components/product/CustomerReviews";
import ReviewMarquee from "@/components/ui/ReviewMarquee";
import ProductQuestions from "@/components/product/ProductQuestions";

interface ProductDetailClientProps {
    slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'shipping'>('description');
    const [reviews, setReviews] = useState<Review[]>([]);

    // Modals State
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [showAskModal, setShowAskModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Ask Question Form State
    const [askFormData, setAskFormData] = useState({ name: '', email: '', mobile: '', message: '' });

    const thumbnailRef = useRef<HTMLDivElement>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const { addItem } = useCartStore();
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const res = await api.get(`/api/products?slug=${slug}`);
                if (res.data.success && res.data.data.length > 0) {
                    const productData = res.data.data[0];
                    setProduct(productData);

                    // Fetch Reviews for this product
                    const reviewsRes = await api.get(`/api/reviews?productId=${productData.id || productData._id}`);
                    if (reviewsRes.data.success) {
                        const mappedReviews = reviewsRes.data.data.map((r: any) => ({
                            id: r._id,
                            author: r.name,
                            initials: r.name ? r.name.substring(0, 1).toUpperCase() : '?',
                            verified: r.verified || false,
                            date: new Date(r.createdAt).toLocaleDateString(),
                            rating: r.rating,
                            content: r.content,
                            photos: r.photos
                        }));
                        setReviews(mappedReviews);
                    }
                } else {
                    console.error("Product not found");
                }

                const relatedRes = await api.get('/api/products');
                if (relatedRes.data.success) {
                    setRelatedProducts(relatedRes.data.data.filter((p: any) => p.slug !== slug).slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [slug]);

    const scrollThumbnails = (direction: 'up' | 'down') => {
        if (thumbnailRef.current) {
            const scrollAmount = 100;
            if (direction === 'up') {
                thumbnailRef.current.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            } else {
                thumbnailRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const scrollToReviews = () => {
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddToCart = async () => {
        try {
            setIsAdding(true);
            const cartItem = {
                id: product.id || product._id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: images[0],
                slug: slug,
                category: product.category,
                quantity: quantity,
                size: selectedSize,
            } as any;

            await addItem(cartItem, accessToken || undefined);
            setTimeout(() => { router.push('/cart'); }, 600);
        } catch (error) {
            console.error("Add to cart failed", error);
            setIsAdding(false);
        }
    };

    const handleWhatsAppOrder = () => {
        const message = `*Order Inquiry*\n\nProduct: ${product.name}\nSize: ${selectedSize}\nPrice: ₹${product.price}\nLink: ${window.location.href}`;
        const phoneNumber = "919876543210"; // Replace with actual support number
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    const handleAskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/questions', {
                productId: product.id || product._id,
                ...askFormData
            });
            if (res.data.success) {
                alert(`Thank you ${askFormData.name}! Your question has been sent.`);
                setShowAskModal(false);
                setAskFormData({ name: '', email: '', mobile: '', message: '' });
            }
        } catch (error) {
            console.error("Failed to submit question", error);
            alert("Failed to send question. Please try again.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><Loader2 className="animate-spin text-primary" size={48} /></div>;
    if (!product) return <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4"><h2 className="text-2xl font-bold mb-4">Product Not Found</h2><Link href="/products" className="bg-primary text-white px-6 py-3 rounded font-bold">Browse Products</Link></div>;

    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL", "XXL"];
    const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

    return (
        <div className="pt-24 pb-20 max-w-[1600px] mx-auto px-4 md:px-8 bg-background text-foreground transition-colors">
            <div className="flex flex-col lg:flex-row gap-12 mb-24">

                {/* Gallery Section */}
                <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <div className="flex md:flex-col order-2 md:order-1 items-center gap-2">
                        <button onClick={() => scrollThumbnails('up')} className="hidden md:flex p-1 text-gray-400 hover:text-primary transition-colors"><ChevronUp size={24} /></button>
                        <div ref={thumbnailRef} className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:h-[600px] scrollbar-hide scroll-smooth">
                            {images.map((img: string, idx: number) => (
                                <button key={idx} onClick={() => setActiveImage(idx)} className={`flex-shrink-0 w-20 h-24 md:w-24 md:h-32 border-2 ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}>
                                    <img src={img} alt="Thumbnail" loading="lazy" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <button onClick={() => scrollThumbnails('down')} className="hidden md:flex p-1 text-gray-400 hover:text-primary transition-colors"><ChevronDown size={24} /></button>
                    </div>
                    <div className="flex-1 order-1 md:order-2 h-[500px] md:h-[700px] overflow-hidden rounded-sm relative bg-secondary">
                        {images[activeImage] && <img src={images[activeImage]} alt="Main" loading="lazy" className="w-full h-full object-cover" />}
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 lg:max-w-xl">
                    <button onClick={scrollToReviews} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400"> ({reviews.length} Reviews)</span>
                    </button>

                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 leading-tight">{product.name}</h1>

                    <div className="flex items-end gap-3 mb-8">
                        <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                        {product.originalPrice && <span className="text-xl text-gray-500 line-through mb-1">₹{product.originalPrice}</span>}
                        {product.originalPrice && <span className="text-xs bg-red-600 text-white font-bold px-2 py-1 mb-1 rounded-sm">SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>}
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Select Size</label>
                            <button onClick={() => setShowSizeChart(true)} className="text-sm text-primary underline font-bold">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {sizes.map((size: string) => (
                                <button key={size} onClick={() => setSelectedSize(size)} className={`w-14 h-12 flex items-center justify-center font-bold border transition-all ${selectedSize === size ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'bg-transparent text-black dark:text-white border-gray-300 dark:border-gray-700 hover:border-primary'}`}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex items-center border border-gray-300 dark:border-gray-700 h-14 w-32 justify-between px-4 bg-background">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-primary"><Minus size={18} /></button>
                                <span className="font-bold text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="hover:text-primary"><Plus size={18} /></button>
                            </div>
                            <button onClick={handleAddToCart} disabled={isAdding} className={`flex-1 font-black uppercase tracking-widest h-14 transition-all flex items-center justify-center gap-2 text-lg ${isAdding ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'}`}>
                                {isAdding ? <><Check size={20} /> Added</> : <><ShoppingCart size={20} /> Add to Cart</>}
                            </button>
                            {/* Wishlist Button - Fixed ID */}
                            <WishlistButton productId={product.id || product._id} className="h-14 w-14 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-none hover:border-primary hover:bg-primary/10 transition-colors" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={handleWhatsAppOrder} className="bg-[#25D366] text-white font-bold uppercase h-12 tracking-wide hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2">
                                <MessageCircle size={20} /> Order on WhatsApp
                            </button>
                            <button onClick={() => setShowShareModal(true)} className="border border-gray-300 dark:border-gray-700 text-black dark:text-white font-bold uppercase h-12 tracking-wide hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                                <Share2 size={20} /> Share
                            </button>
                        </div>

                        <button onClick={() => setShowAskModal(true)} className="w-full border border-gray-300 dark:border-gray-700 text-gray-500 hover:text-black dark:hover:text-white h-10 text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
                            Ask a Question
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-white/10 pt-6">
                        <div className="flex items-center gap-2"><Truck size={16} /> <span>Free Shipping &gt; ₹1799</span></div>
                        <div className="flex items-center gap-2"><Shield size={16} /> <span>Secure Payments</span></div>
                        <div className="flex items-center gap-2"><RotateCcw size={16} /> <span>7 Days Easy Return</span></div>
                        <div className="flex items-center gap-2"><Shirt size={16} /> <span>Premium Quality</span></div>
                    </div>
                </div>
            </div>

            {/* Product Tabs */}
            <div className="mb-16">
                <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto">
                    {['description', 'shipping'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-lg font-bold uppercase tracking-wide py-4 px-8 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-primary text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
                            {tab === 'shipping' ? 'Shipping & Return' : 'Product Description'}
                        </button>
                    ))}
                </div>

                <div className="min-h-[150px] text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                    {activeTab === 'description' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                            <p className="mb-4">{product.description}</p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li><strong>Material:</strong> 100% Cotton Fleece (350 GSM)</li>
                                <li><strong>Fit:</strong> Oversized / Drop Shoulder</li>
                                <li><strong>Print:</strong> High-Density Puff Print</li>
                                <li><strong>Care:</strong> Machine wash cold, do not bleach.</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl space-y-4">
                            <p>Shipping cost is based on weight. Just add products to your cart and use the Shipping Calculator to see the shipping price.</p>
                            <p>We want you to be 100% satisfied with your purchase. Items can be returned or exchanged within 30 days of delivery.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Questions & Answers */}
            <ProductQuestions productId={product.id || product._id} />

            {/* Reviews Section */}
            <CustomerReviews
                reviews={reviews}
                productName={product.name}
                productImage={images[0]}
                productId={product.id || product._id}
            />

            {/* Review Marquee */}
            <div className="mt-20 border-t border-gray-100 dark:border-gray-800">
                <ReviewMarquee />
            </div>

            {/* Related Products */}
            <div className="border-t border-gray-200 dark:border-white/10 pt-16 mt-16">
                <h2 className="text-3xl font-black uppercase text-center mb-12 text-black dark:text-white">You Might Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {relatedProducts.length > 0 ? relatedProducts.map(rp => (
                        <Link href={`/product/${rp.slug}`} key={rp.id || rp._id} className="group cursor-pointer">
                            <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 relative">
                                <img src={rp.image || rp.images?.[0]} alt={rp.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <h3 className="font-bold text-black dark:text-white text-sm uppercase mb-1 truncate">{rp.name}</h3>
                            <p className="text-primary font-bold">₹{rp.price}</p>
                        </Link>
                    )) : <p className="col-span-4 text-center text-gray-500">No related products found.</p>}
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {/* Size Chart Modal */}
                {showSizeChart && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-[#111] p-6 rounded-lg max-w-lg w-full relative">
                            <button onClick={() => setShowSizeChart(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"><X size={24} /></button>
                            <h2 className="text-2xl font-black uppercase mb-6 text-center text-black dark:text-white">Shirts Size Chart</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
                                            <th className="p-3 border-b dark:border-gray-700">Size</th>
                                            <th className="p-3 border-b dark:border-gray-700">Chest</th>
                                            <th className="p-3 border-b dark:border-gray-700">Waist</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700 dark:text-gray-300">
                                        <tr><td className="p-3 border-b dark:border-gray-800 font-bold">S</td><td className="p-3 border-b dark:border-gray-800">35-37</td><td className="p-3 border-b dark:border-gray-800">29-31</td></tr>
                                        <tr><td className="p-3 border-b dark:border-gray-800 font-bold">M</td><td className="p-3 border-b dark:border-gray-800">38-40</td><td className="p-3 border-b dark:border-gray-800">32-34</td></tr>
                                        <tr><td className="p-3 border-b dark:border-gray-800 font-bold">L</td><td className="p-3 border-b dark:border-gray-800">42-44</td><td className="p-3 border-b dark:border-gray-800">36-38</td></tr>
                                        <tr><td className="p-3 border-b dark:border-gray-800 font-bold">XL</td><td className="p-3 border-b dark:border-gray-800">46-48</td><td className="p-3 border-b dark:border-gray-800">40-42</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Share Modal */}
                {showShareModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="bg-white dark:bg-[#111] p-6 rounded-lg max-w-md w-full relative">
                            <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"><X size={24} /></button>
                            <h2 className="text-xl font-bold uppercase mb-6 text-black dark:text-white">Share Product</h2>
                            <div className="flex gap-4 justify-center mb-6">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"><Share2 size={20} /></a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`} target="_blank" className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600"><Share2 size={20} /></a>
                                <a href={`https://wa.me/?text=${encodeURIComponent(product.name + ' ' + window.location.href)}`} target="_blank" className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"><MessageCircle size={20} /></a>
                            </div>
                            <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 p-2 rounded bg-gray-50 dark:bg-black">
                                <input readOnly value={window.location.href} className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-400 outline-none" />
                                <button onClick={handleCopyLink} className="p-2 text-primary font-bold text-sm hover:underline flex items-center gap-1"><Copy size={14} /> Copy</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Ask Question Modal */}
                {showAskModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="bg-white dark:bg-[#111] p-6 rounded-lg max-w-md w-full relative">
                            <button onClick={() => setShowAskModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"><X size={24} /></button>
                            <h2 className="text-xl font-bold uppercase mb-4 text-black dark:text-white">Ask a Question</h2>
                            <form onSubmit={handleAskSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Name *</label>
                                    <input required type="text" value={askFormData.name} onChange={e => setAskFormData({ ...askFormData, name: e.target.value })} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 p-3 rounded text-black dark:text-white outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email *</label>
                                    <input required type="email" value={askFormData.email} onChange={e => setAskFormData({ ...askFormData, email: e.target.value })} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 p-3 rounded text-black dark:text-white outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mobile *</label>
                                    <input required type="tel" value={askFormData.mobile} onChange={e => setAskFormData({ ...askFormData, mobile: e.target.value })} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 p-3 rounded text-black dark:text-white outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Message *</label>
                                    <textarea required value={askFormData.message} onChange={e => setAskFormData({ ...askFormData, message: e.target.value })} className="w-full h-24 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 p-3 rounded text-black dark:text-white outline-none focus:border-primary" />
                                </div>
                                <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase py-3 rounded hover:opacity-90 transition-opacity">Submit</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
