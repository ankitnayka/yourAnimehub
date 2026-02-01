'use client';

import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

export default function AnnouncementSettingsPage() {
    const [text, setText] = useState('');
    const [isActive, setIsActive] = useState(true);
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
                setText(data.data.announcementText || '');
                setIsActive(data.data.announcementActive !== false); // Default true
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
            // Using /api/settings route which we updated to handle PUT
            const { data } = await api.put('/api/settings', {
                announcementText: text,
                announcementActive: isActive
            });

            if (data.success) {
                setMessage({ type: 'success', text: 'Announcement updated successfully' });
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
                    Announcement Bar Logic
                </h1>
                <p className="text-gray-400">
                    Manage the scrolling announcement bar at the top of the site.
                </p>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-6">

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <div>
                        <h3 className="font-bold text-white">Enable Announcement Bar</h3>
                        <p className="text-sm text-gray-500">Show or hide the announcement bar globally</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                {/* Text Input */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">
                        Announcement Text
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="e.g. FREE SHIPPING ON ALL ORDERS"
                            className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            This text will be repeated in a scrolling marquee.
                        </p>
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
