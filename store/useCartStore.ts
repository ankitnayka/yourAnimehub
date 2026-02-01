import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";
import api from "@/lib/api";
import { useAuthStore } from "./useAuthStore";

interface CartItem extends Product {
    quantity: number;
    size?: string;
    color?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    isSyncing: boolean;
    addItem: (product: Product, token?: string) => Promise<void>;
    removeItem: (productId: string, token?: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number, token?: string) => Promise<void>;
    clearCart: (token?: string) => Promise<void>;
    syncCart: (token: string) => Promise<void>;
    fetchCart: (token: string) => Promise<void>;
    setIsOpen: (isOpen: boolean) => void;
    toggleCart: () => void;
    getTotalAmount: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            isSyncing: false,

            addItem: async (product, token) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === product.id);

                // Check if user is authenticated (either via token or session)
                const isAuthenticated = !!token || useAuthStore.getState().isAuthenticated;

                // Get quantity from product if available (cast to any to avoid TS error if Product type doesn't have quantity)
                const quantityToAdd = (product as any).quantity || 1;

                if (isAuthenticated) {
                    // Add to database
                    try {
                        set({ isSyncing: true });
                        const response = await api.post('/api/cart', {
                            productId: product.id,
                            quantity: quantityToAdd
                        });

                        if (response.data.success) {
                            // Update local state from server response
                            const cartData = response.data.data;
                            const formattedItems = cartData.items.map((item: any) => ({
                                id: item.productId,
                                name: item.title,
                                price: item.price,
                                image: item.image,
                                slug: item.slug,
                                quantity: item.quantity,
                                originalPrice: item.originalPrice,
                                discountPercentage: item.discountPercentage,
                                // Preserve size/color if they exist in the incoming product but not yet in backend response structure explicitly?
                                // Ideally backend should return them. For now we trust the formatted items.
                            }));
                            set({ items: formattedItems });
                        }
                    } catch (error) {
                        console.error('Failed to add item to cart:', error);
                        // Fallback to local update
                        if (existingItem) {
                            set({
                                items: currentItems.map((item) =>
                                    item.id === product.id
                                        ? { ...item, quantity: item.quantity + quantityToAdd }
                                        : item
                                ),
                            });
                        } else {
                            set({
                                items: [...currentItems, { ...product, quantity: quantityToAdd }],
                            });
                        }
                    } finally {
                        set({ isSyncing: false });
                    }
                } else {
                    // Local only (user not logged in)
                    if (existingItem) {
                        set({
                            items: currentItems.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + quantityToAdd }
                                    : item
                            ),
                        });
                    } else {
                        set({
                            items: [...currentItems, { ...product, quantity: quantityToAdd }],
                        });
                    }
                }
            },

            removeItem: async (productId, token) => {
                const isAuthenticated = !!token || useAuthStore.getState().isAuthenticated;

                if (isAuthenticated) {
                    try {
                        set({ isSyncing: true });
                        await api.delete(`/api/cart/${productId}`);
                    } catch (error) {
                        console.error('Failed to remove item:', error);
                    } finally {
                        set({ isSyncing: false });
                    }
                }

                set({
                    items: get().items.filter((item) => item.id !== productId),
                });
            },

            updateQuantity: async (productId, quantity, token) => {
                if (quantity <= 0) {
                    get().removeItem(productId, token);
                    return;
                }

                const isAuthenticated = !!token || useAuthStore.getState().isAuthenticated;

                if (isAuthenticated) {
                    try {
                        set({ isSyncing: true });
                        await api.patch(`/api/cart/${productId}`, { quantity });
                    } catch (error) {
                        console.error('Failed to update quantity:', error);
                    } finally {
                        set({ isSyncing: false });
                    }
                }

                set({
                    items: get().items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                });
            },

            syncCart: async (token: string) => {
                try {
                    set({ isSyncing: true });
                    const localItems = get().items;

                    // Format items for API
                    const formattedItems = localItems.map(item => ({
                        productId: item.id,
                        title: item.name,
                        image: item.image,
                        price: item.price,
                        originalPrice: item.originalPrice || item.price,
                        discountPercentage: item.discountPercentage || 0,
                        quantity: item.quantity,
                        slug: item.slug,
                        size: null,
                        color: null
                    }));

                    await api.put('/api/cart', { items: formattedItems });
                } catch (error) {
                    console.error("Cart sync failed", error);
                } finally {
                    set({ isSyncing: false });
                }
            },

            fetchCart: async (token: string) => {
                try {
                    set({ isSyncing: true });
                    const res = await api.get('/api/cart');

                    if (res.data.success) {
                        const cartData = res.data.data;
                        const formattedItems = cartData.items.map((item: any) => ({
                            id: item.productId,
                            name: item.title,
                            price: item.price,
                            image: item.image,
                            slug: item.slug,
                            quantity: item.quantity,
                            originalPrice: item.originalPrice,
                            discountPercentage: item.discountPercentage
                        }));
                        set({ items: formattedItems });
                    }
                } catch (error) {
                    console.error("Cart fetch failed", error);
                } finally {
                    set({ isSyncing: false });
                }
            },

            clearCart: async (token) => {
                const isAuthenticated = !!token || useAuthStore.getState().isAuthenticated;

                if (isAuthenticated) {
                    try {
                        set({ isSyncing: true });
                        await api.delete('/api/cart');
                    } catch (error) {
                        console.error('Failed to clear cart:', error);
                    } finally {
                        set({ isSyncing: false });
                    }
                }
                set({ items: [] });
            },

            setIsOpen: (isOpen) => set({ isOpen }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            getTotalAmount: () => {
                return get().items.reduce((total, item) => {
                    return total + (item.price * item.quantity);
                }, 0);
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            }
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
