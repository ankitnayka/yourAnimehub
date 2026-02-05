'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import axios from 'axios';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(''); // Add phone state
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const getPasswordStrength = (pass: string) => {
        if (!pass) return { label: '', color: '' };
        if (pass.length < 6) return { label: 'Very Weak (min 6 chars)', color: 'text-red-600' };

        const hasLetter = /[a-zA-Z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSymbol = /[^a-zA-Z0-9]/.test(pass);

        const filledConditions = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length;

        if (filledConditions === 3) return { label: 'Strong', color: 'text-green-500' };
        if (filledConditions === 2) return { label: 'Weak', color: 'text-yellow-500' };
        return { label: 'Poor', color: 'text-red-500' };
    };

    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (!hasLetter || !hasNumber || !hasSymbol) {
            setError('Password must include at least one letter, one number, and one symbol');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/auth/register', { name, email, phone, password }); // Include phone
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
                        placeholder="Mivaan Rathod"
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
                        placeholder="name@gmail.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="1234567890"
                        required
                    />
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors pr-12"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[34px] text-neutral-500 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {password && (
                        <div className="mt-1 flex justify-end">
                            <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                {passwordStrength.label}
                            </span>
                        </div>
                    )}
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
