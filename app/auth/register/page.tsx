'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/register', { name, email, password });
            router.push('/auth/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join the community and start your journey">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="name@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center uppercase tracking-wider text-sm mt-6"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
                </button>

                <p className="text-center text-neutral-500 text-sm mt-6">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-red-500 hover:text-red-400 font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
