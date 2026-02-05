import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, Search } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import Settings from '@/models/Settings';

async function getSettings() {
    try {
        await dbConnect();
        const settings = await Settings.findOne().lean();
        return settings || { socialLinks: {}, contactInfo: {} };
    } catch (e) {
        console.error("Failed to fetch settings for footer", e);
        return { socialLinks: {}, contactInfo: {} };
    }
}

export default async function Footer() {
    const settings = await getSettings();
    const { socialLinks, contactInfo } = settings as any;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 dark:bg-[#0f172a] text-black dark:text-white pt-16 pb-8 border-t border-gray-200 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Column 1: Reviews & Social */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            {/* Dummy Google Logo/Review */}
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-500">
                                Google
                            </span>
                            <div className="flex gap-0.5 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                            Rated 5/5 based on 200+ reviews
                        </p>

                        <div>
                            <h4 className="font-bold text-lg mb-4 text-black dark:text-white">Follow us on social media</h4>
                            <div className="flex gap-4">
                                {socialLinks?.facebook && (
                                    <SocialIcon href={socialLinks.facebook} icon={<Facebook size={20} />} label="Facebook" color="bg-[#1877F2]" />
                                )}
                                {socialLinks?.instagram && (
                                    <SocialIcon href={socialLinks.instagram} icon={<Instagram size={20} />} label="Instagram" color="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]" />
                                )}
                                {socialLinks?.twitter && (
                                    <SocialIcon href={socialLinks.twitter} icon={<Twitter size={20} />} label="Twitter" color="bg-[#1DA1F2]" />
                                )}
                                {socialLinks?.linkedin && (
                                    <SocialIcon href={socialLinks.linkedin} icon={<Linkedin size={20} />} label="LinkedIn" color="bg-[#0A66C2]" />
                                )}
                                {socialLinks?.youtube && (
                                    <SocialIcon href={socialLinks.youtube} icon={<Youtube size={20} />} label="YouTube" color="bg-[#FF0000]" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Products */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-black dark:text-white uppercase tracking-wider">Products</h3>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                            <li><Link href="/products?new=true" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/products?featured=true" className="hover:text-primary transition-colors">Featured Products</Link></li>
                            {/* <li><Link href="/products?category=apparel" className="hover:text-primary transition-colors">Apparel</Link></li> */}

                        </ul>
                    </div>

                    {/* Column 3: Services/Help */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-black dark:text-white uppercase tracking-wider">Help</h3>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                            <li><Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search this site"
                                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-full py-3 px-5 text-sm text-black dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary dark:hover:text-white">
                                    <Search size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-6 text-black dark:text-white uppercase tracking-wider">Contact</h3>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                            {contactInfo?.address && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="shrink-0 mt-1 text-primary" size={18} />
                                    <span>{contactInfo.address}</span>
                                </li>
                            )}
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>Chat with an Expert</span>
                            </li>
                            {contactInfo?.phone && (
                                <li className="flex items-center gap-3">
                                    <Phone className="shrink-0 text-primary" size={18} />
                                    <span>{contactInfo.phone}</span>
                                </li>
                            )}
                            {contactInfo?.email && (
                                <li className="flex items-center gap-3">
                                    <Mail className="shrink-0 text-primary" size={18} />
                                    <span>{contactInfo.email}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap justify-center gap-2">
                        {/* Payment Icons */}
                        <div className="flex gap-2 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                            <div className="bg-white border border-gray-200 dark:border-none p-1 rounded w-10 h-6 flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-full object-contain" /></div>
                            <div className="bg-white border border-gray-200 dark:border-none p-1 rounded w-10 h-6 flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-full object-contain" /></div>
                            <div className="bg-white border border-gray-200 dark:border-none p-1 rounded w-10 h-6 flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-full object-contain" /></div>
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm">
                        © {currentYear} YourAnimeHub All rights reserved.
                    </p>

                    <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                        <Link href="/" className="hover:text-primary dark:hover:text-white transition-colors">Home</Link>
                        <Link href="/privacy-policy" className="hover:text-primary dark:hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-primary dark:hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ href, icon, label, color }: { href: string, icon: React.ReactNode, label: string, color: string }) {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:-translate-y-1 ${color}`}
        >
            {icon}
        </a>
    );
}
