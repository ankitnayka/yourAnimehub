import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 text-center text-black dark:text-white">Contact Us</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="prose prose-invert">
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Get in Touch</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Have a question about your order or our products? We're here to help!
                            Fill out the form or reach out to us directly using the contact information below.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#111] flex items-center justify-center text-primary shrink-0 transition-colors">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-black dark:text-white mb-1">Our Location</h3>
                                <p className="text-gray-600 dark:text-gray-400">123 Anime Street, Akihabara District,<br />Tokyo, Japan 101-0021</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#111] flex items-center justify-center text-primary shrink-0 transition-colors">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-black dark:text-white mb-1">Email Us</h3>
                                <p className="text-gray-600 dark:text-gray-400">support@youranimehub.com</p>
                                <p className="text-gray-600 dark:text-gray-400">info@youranimehub.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#111] flex items-center justify-center text-primary shrink-0 transition-colors">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-black dark:text-white mb-1">Call Us</h3>
                                <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                                <p className="text-xs text-gray-500 mt-1">Mon - Fri, 9am - 6pm EST</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#111] flex items-center justify-center text-primary shrink-0 transition-colors">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-black dark:text-white mb-1">Business Hours</h3>
                                <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p className="text-gray-600 dark:text-gray-400">Weekend: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm transition-colors">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Name</label>
                                <input type="text" className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#333] rounded-lg p-3 text-black dark:text-white focus:outline-none focus:border-primary transition-colors" placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Email</label>
                                <input type="email" className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#333] rounded-lg p-3 text-black dark:text-white focus:outline-none focus:border-primary transition-colors" placeholder="your@email.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Subject</label>
                            <input type="text" className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#333] rounded-lg p-3 text-black dark:text-white focus:outline-none focus:border-primary transition-colors" placeholder="How can we help?" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Message</label>
                            <textarea rows={5} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#333] rounded-lg p-3 text-black dark:text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Write your message here..."></textarea>
                        </div>

                        <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
