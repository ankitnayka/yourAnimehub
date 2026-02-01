'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, MapPin, Edit2, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import AddressModal from '@/components/Modals/AddressModal';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function AddressesPage() {
    const { isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [headerText, setHeaderText] = useState('My Addresses');
    const [addressToEdit, setAddressToEdit] = useState<any>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login?redirect=/account/addresses');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAddresses();
        }
    }, [isAuthenticated]);

    const fetchAddresses = async () => {
        try {
            setPageLoading(true);
            const { data } = await api.get('/api/user/addresses');
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error('Failed to fetch addresses');
        } finally {
            setPageLoading(false);
        }
    };

    const handleEdit = (addr: any) => {
        setAddressToEdit(addr);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setAddressToEdit(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const { data } = await api.delete(`/api/user/addresses?id=${addressId}`);
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error('Failed to delete address');
            alert('Failed to delete address');
        }
    };

    if (isLoading || pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Breadcrumb />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <h1 className="text-4xl font-bold font-oswald uppercase">{headerText} ({addresses.length})</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-neutral-200 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-neutral-800 border-dashed">
                    <MapPin className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-neutral-400 mb-2">No addresses found</h3>
                    <p className="text-neutral-500 mb-6">Add a shipping address to speed up checkout.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addresses.map((addr: any) => (
                        <div key={addr._id} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl relative group hover:border-neutral-600 transition-colors">
                            {addr.isDefault && (
                                <span className="absolute top-4 right-4 bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">DEFAULT</span>
                            )}

                            <h3 className="font-bold text-lg mb-2">{addr.city}, {addr.country}</h3>
                            <div className="text-neutral-400 text-sm space-y-1 mb-6">
                                <p>{addr.street}</p>
                                <p>{addr.state} {addr.zip}</p>
                                <p>{addr.phone}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(addr._id)}
                                    className="flex items-center gap-2 text-sm font-medium hover:text-red-500 transition-colors text-neutral-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAddresses}
                addressToEdit={addressToEdit}
            />
        </div>
    );
}
