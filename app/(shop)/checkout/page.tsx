'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/lib/orderHelpers';
import Image from 'next/image';
import api from '@/lib/api';
import { Check, MapPin, Plus } from 'lucide-react';

interface ShippingAddress {
    _id?: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    isDefault?: boolean;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalAmount, getItemCount, clearCart } = useCartStore();
    const { user, accessToken } = useAuthStore();

    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new');
    const [address, setAddress] = useState<ShippingAddress>({
        name: user?.name || '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        phone: ''
    });

    useEffect(() => {
        // Redirect if not logged in
        if (!user) {
            router.push('/auth/login?redirect=/checkout');
            return;
        }

        // Redirect if cart is empty
        if (items.length === 0) {
            router.push('/cart');
            return;
        }

        fetchSavedAddresses();

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [user, items, router]);

    const fetchSavedAddresses = async () => {
        try {
            const { data } = await api.get('/api/user/addresses');
            if (data.success && data.addresses.length > 0) {
                setSavedAddresses(data.addresses);

                // Pre-select default address or the first one
                const defaultAddr = data.addresses.find((a: ShippingAddress) => a.isDefault);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr._id!);
                    setAddress(defaultAddr);
                } else if (data.addresses.length > 0) {
                    setSelectedAddressId(data.addresses[0]._id!);
                    setAddress(data.addresses[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch addresses', error);
        }
    };

    const handleAddressSelect = (addrId: string) => {
        setSelectedAddressId(addrId);
        if (addrId === 'new') {
            setAddress({
                name: user?.name || '',
                street: '',
                city: '',
                state: '',
                zip: '',
                country: 'India',
                phone: ''
            });
        } else {
            const selected = savedAddresses.find(a => a._id === addrId);
            if (selected) {
                setAddress(selected);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // If we are editing, we are essentially in "new address" mode conceptually for the form, 
        // but if the user selected a saved address, modifying it here WON'T update the saved address in DB automatically.
        // For simplicity, if user types in the form, we treat it as the current active address data used for order.
        // We might want to switch to 'new' mode if they start typing to avoid confusion, 
        // OR just simple binding is enough. Let's keep simple binding.
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const validateAddress = (): boolean => {
        const requiredFields: (keyof ShippingAddress)[] = ['name', 'street', 'city', 'state', 'zip', 'country', 'phone'];
        for (const field of requiredFields) {
            if (!address[field] || String(address[field]).trim() === '') {
                alert(`Please fill in ${field}`);
                return false;
            }
        }
        return true;
    };

    const handleRazorpayPayment = async (orderId: string) => {
        try {
            // Create Razorpay order
            const response = await api.post('/api/orders/create-razorpay', { orderId });
            const { orderId: razorpayOrderId, amount, currency, orderDbId } = response.data.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: 'Your Anime Hub',
                description: 'Order Payment',
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment
                        const verifyResponse = await api.post('/api/orders/verify-payment', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderId: orderDbId
                        });

                        if (verifyResponse.data.success) {
                            // Clear cart and redirect
                            await clearCart(accessToken || undefined);
                            router.push(`/order/success?orderId=${orderDbId}`);
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        alert('Payment verification failed. Please contact support.');
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: address.name,
                    email: user?.email || '',
                    contact: address.phone
                },
                theme: {
                    color: '#2563eb'
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Razorpay payment error:', error);
            alert('Failed to initiate payment. Please try again.');
            setIsProcessing(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateAddress()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Create order
            const response = await api.post('/api/orders', {
                shippingAddress: address,
                paymentMethod
            });

            if (response.data.success) {
                const order = response.data.data;

                if (paymentMethod === 'Online') {
                    // Initiate Razorpay payment
                    await handleRazorpayPayment(order._id);
                } else {
                    // COD - Order placed successfully
                    await clearCart(accessToken || undefined);
                    router.push(`/order/success?orderId=${order._id}`);
                }
            } else {
                alert(response.data.message || 'Failed to create order');
                setIsProcessing(false);
            }
        } catch (error: any) {
            console.error('Order creation error:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to place order. Please try again.';
            alert(errorMessage);
            setIsProcessing(false);
        }
    };

    if (!user || items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Saved Addresses Selection */}
                        {savedAddresses.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Saved Addresses
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedAddresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => handleAddressSelect(addr._id!)}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${selectedAddressId === addr._id ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                                        >
                                            {selectedAddressId === addr._id && (
                                                <div className="absolute top-2 right-2 text-primary">
                                                    <Check size={16} />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin size={16} className="text-gray-500" />
                                                <span className="font-bold">{addr.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {addr.street}, {addr.city}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {addr.state}, {addr.zip}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {addr.phone}
                                            </p>
                                        </div>
                                    ))}

                                    <div
                                        onClick={() => handleAddressSelect('new')}
                                        className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:border-primary h-full min-h-[140px] ${selectedAddressId === 'new' ? 'border-primary text-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'}`}
                                    >
                                        <Plus size={24} className="mb-2" />
                                        <span className="font-medium">Add New Address</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Shipping Address Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {selectedAddressId === 'new' ? 'New Shipping Address' : 'Shipping Address Details'}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={address.name || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={address.street || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={address.city || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={address.state || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={address.zip || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={address.country || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={address.phone || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Payment Method
                            </h2>

                            <div className="space-y-4">
                                <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-primary'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value as 'COD')}
                                        className="mt-1 mr-3 accent-primary"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            Cash on Delivery
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Pay with cash when your order is delivered
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'Online' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-primary'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Online"
                                        checked={paymentMethod === 'Online'}
                                        onChange={(e) => setPaymentMethod(e.target.value as 'Online')}
                                        className="mt-1 mr-3 accent-primary"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            Online Payment (Razorpay)
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Pay securely using Credit/Debit Card, UPI, Net Banking
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Order Summary
                            </h2>

                            {/* Items List */}
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Size: {item.size || 'M'}
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">
                                        {formatCurrency(getTotalAmount())}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        FREE
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span>{formatCurrency(getTotalAmount())}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </button>

                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                                By placing your order, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper for custom scrollbar (optional, but nice to have)
const style = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
`;
