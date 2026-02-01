import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

// Define the Wishlist Store State
interface WishlistState {
    items: string[]; // Array of Product IDs
    fullItems: any[]; // Populated items for displaying on Wishlist page
    isLoading: boolean;

    // Actions
    addItem: (productId: string, token?: string) => Promise<void>;
    removeItem: (productId: string, token?: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    fetchWishlist: (token: string) => Promise<void>;
    syncWishlist: (token: string) => Promise<void>;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            fullItems: [],
            isLoading: false,

            addItem: async (productId, token) => {
                const { items } = get();
                // Optimistic Update
                if (!items.includes(productId)) {
                    set({ items: [...items, productId] });

                    if (token) {
                        try {
                            await axios.post('/api/wishlist', { productId }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                        } catch (error) {
                            console.error("Failed to sync add to server", error);
                            // Rollback? No, keep it locally at least.
                        }
                    }
                }
            },

            removeItem: async (productId, token) => {
                const { items } = get();
                // Optimistic Update
                set({ items: items.filter((id) => id !== productId) });

                if (token) {
                    try {
                        // Use delete with data payload (axios specific)
                        await axios.delete('/api/wishlist', {
                            headers: { Authorization: `Bearer ${token}` },
                            data: { productId }
                        });
                    } catch (error) {
                        console.error("Failed to sync remove to server", error);
                    }
                }
            },

            isInWishlist: (productId) => {
                return get().items.includes(productId);
            },

            fetchWishlist: async (token) => {
                set({ isLoading: true });
                try {
                    const { data } = await axios.get('/api/wishlist', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (data.success) {
                        // Backend returns full objects
                        const ids = data.data.map((item: any) => item._id);
                        set({ items: ids, fullItems: data.data });
                    }
                } catch (error) {
                    console.error("Failed to fetch wishlist", error);
                } finally {
                    set({ isLoading: false });
                }
            },

            syncWishlist: async (token) => {
                const { items } = get();
                if (items.length === 0) return;

                try {
                    await axios.put('/api/wishlist', { productIds: items }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // After sync, fetch fresh data to ensure consistency and get populated objects
                    get().fetchWishlist(token);
                } catch (error) {
                    console.error("Failed to sync wishlist", error);
                }
            },

            clearWishlist: () => set({ items: [], fullItems: [] })
        }),
        {
            name: 'wishlist-storage', // name of item in localStorage
            partialize: (state) => ({ items: state.items }), // Only persist IDs
        }
    )
);
