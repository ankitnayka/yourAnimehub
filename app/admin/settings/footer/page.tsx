'use client';

import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import api from '@/lib/api';

export default function FooterSettingsPage() {
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: ''
    });
    const [contactInfo, setContactInfo] = useState({
        address: '',
        phone: '',
        email: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/api/settings');
            if (data.success && data.data) {
                setSocialLinks({
                    facebook: data.data.socialLinks?.facebook || '',
                    instagram: data.data.socialLinks?.instagram || '',
                    twitter: data.data.socialLinks?.twitter || '',
                    youtube: data.data.socialLinks?.youtube || '',
                    linkedin: data.data.socialLinks?.linkedin || ''
                });
                setContactInfo({
                    address: data.data.contactInfo?.address || '',
                    phone: data.data.contactInfo?.phone || '',
                    email: data.data.contactInfo?.email || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            const { data } = await api.put('/api/settings', {
                socialLinks,
                contactInfo
            });

            if (data.success) {
                setMessage({ type: 'success', text: 'Footer settings updated successfully' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update' });
            }
        } catch (error) {
            console.error('Update error:', error);
            setMessage({ type: 'error', text: 'Failed to save changes' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-400">Loading settings...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                    Footer Management
                </h1>
                <p className="text-gray-400">
                    Manage social media links and contact information displayed in the footer.
                </p>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-8">

                {/* Social Media Section */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-[#222] pb-2">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SocialInput
                            icon={<Facebook size={18} />}
                            label="Facebook"
                            value={socialLinks.facebook}
                            onChange={(v) => setSocialLinks({ ...socialLinks, facebook: v })}
                        />
                        <SocialInput
                            icon={<Instagram size={18} />}
                            label="Instagram"
                            value={socialLinks.instagram}
                            onChange={(v) => setSocialLinks({ ...socialLinks, instagram: v })}
                        />
                        <SocialInput
                            icon={<Twitter size={18} />}
                            label="Twitter / X"
                            value={socialLinks.twitter}
                            onChange={(v) => setSocialLinks({ ...socialLinks, twitter: v })}
                        />
                        <SocialInput
                            icon={<Linkedin size={18} />}
                            label="LinkedIn"
                            value={socialLinks.linkedin}
                            onChange={(v) => setSocialLinks({ ...socialLinks, linkedin: v })}
                        />
                        <SocialInput
                            icon={<Youtube size={18} />}
                            label="YouTube"
                            value={socialLinks.youtube}
                            onChange={(v) => setSocialLinks({ ...socialLinks, youtube: v })}
                        />
                    </div>
                </div>

                {/* Contact Info Section */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-[#222] pb-2">Contact Information</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                <MapPin size={16} /> Address
                            </label>
                            <input
                                type="text"
                                value={contactInfo.address}
                                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                                placeholder="e.g. 123 Fashion St, Design City"
                                className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                    <Phone size={16} /> Phone
                                </label>
                                <input
                                    type="text"
                                    value={contactInfo.phone}
                                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                    placeholder="e.g. +1 (555) 123-4567"
                                    className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                    <Mail size={16} /> Email
                                </label>
                                <input
                                    type="text"
                                    value={contactInfo.email}
                                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                    placeholder="e.g. support@fash.com"
                                    className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feedback Message */}
                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
                        ? 'bg-green-900/20 text-green-400 border border-green-900/50'
                        : 'bg-red-900/20 text-red-400 border border-red-900/50'
                        }`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}

                {/* Save Button */}
                <div className="pt-4 border-t border-[#222] flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-bold uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SocialInput({ icon, label, value, onChange }: { icon: React.ReactNode, label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                {icon} {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`https://${label.toLowerCase()}.com/...`}
                className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
        </div>
    );
}
