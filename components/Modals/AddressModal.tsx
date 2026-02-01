'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    addressToEdit?: any;
}

export default function AddressModal({ isOpen, onClose, onSuccess, addressToEdit }: AddressModalProps) {
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        isDefault: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (addressToEdit) {
            setFormData({
                street: addressToEdit.street || '',
                city: addressToEdit.city || '',
                state: addressToEdit.state || '',
                zip: addressToEdit.zip || '',
                country: addressToEdit.country || '',
                phone: addressToEdit.phone || '',
                isDefault: addressToEdit.isDefault || false
            });
        } else {
            setFormData({
                street: '',
                city: '',
                state: '',
                zip: '',
                country: '',
                phone: '',
                isDefault: false
            });
        }
    }, [addressToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (addressToEdit) {
                await api.put('/api/user/addresses', { ...formData, _id: addressToEdit._id });
            } else {
                await api.post('/api/user/addresses', formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save address');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/80 z-[60]" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none"
                    >
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg pointer-events-auto shadow-2xl relative overflow-y-auto max-h-[90vh]">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-2xl font-bold font-oswald mb-6">
                                {addressToEdit ? 'Edit Address' : 'Add New Address'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-1">ZIP / Postal Code</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="isDefault" className="text-sm text-neutral-300">Set as default address</label>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {addressToEdit ? 'Update Address' : 'Add Address'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
