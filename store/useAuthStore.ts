import { create } from 'zustand';
import axios from 'axios';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (user: User, token: string | null) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,

    login: (user, token) => {
        set({ user, accessToken: token, isAuthenticated: true });
    },

    logout: async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (e) {
            console.error("Logout failed", e);
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axios.post('/api/auth/refresh-token');
            if (data.accessToken) {
                const userResponse = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${data.accessToken}` }
                });
                set({
                    user: userResponse.data.user,
                    accessToken: data.accessToken,
                    isAuthenticated: true
                });
            }
        } catch (error) {
            set({ user: null, accessToken: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    },

    setLoading: (loading) => set({ isLoading: loading }),
}));
