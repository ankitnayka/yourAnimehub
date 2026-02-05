'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { Loader2, Eye, EyeOff } from 'lucide-react';

// ... imports

export default function LoginPage() {
    const [mode, setMode] = useState<'password' | 'forgot' | 'reset-final'>('password');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [phone, setPhone] = useState(''); // Phone no longer needed for login
    // const [otp, setOtp] = useState('');     // OTP logic handled in ResetPasswordForm or removed here? 
    // Wait, ResetPasswordForm uses otp. But the main form doesn't need 'otp' state for Login via OTP anymore.
    // However, keeping strict clean up is better.
    // I'll keep local state usage minimal.

    // Actually, let's keep it simple and just update the component function body.

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (mode === 'password') {
            try {
                const response = await axios.post('/api/auth/login', { email, password });
                const { user, accessToken } = response.data;
                login(user, accessToken);
                if (['admin', 'super-admin', 'sub-admin'].includes(user.role)) {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } catch (err: any) {
                setError(err.response?.data?.error || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        } else if (mode === 'forgot') {
            // Forgot Password via EMAIL Flow
            try {
                // Send Email OTP
                await axios.post('/api/auth/forgot-password', { email });
                setMode('reset-final'); // Move to Reset form
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to send OTP');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/admin' });
    };

    return (
        <AuthLayout
            title={mode === 'password' ? "Welcome Back" : "Reset Password"}
            subtitle={mode === 'password' ? "Sign in to your account to continue" : "Enter email to receive OTP"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* EMAIL & PASS LOGIN */}
                {mode === 'password' && (
                    <>
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
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1">
                                <button type="button" onClick={() => { setMode('forgot'); setError(''); }} className="text-xs text-red-500 hover:text-red-400">
                                    Forgot Password?
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* FORGOT PASSWORD (EMAIL) */}
                {mode === 'forgot' && (
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Enter Registered Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                )}

                {mode === 'reset-final' && (
                    <ResetPasswordForm email={email} setError={setError} setLoading={setLoading} router={router} />
                )}

                {mode !== 'reset-final' && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center uppercase tracking-wider text-sm mt-6"
                    >
                        {loading
                            ? <Loader2 className="animate-spin w-5 h-5" />
                            : (mode === 'password' ? 'Sign In' : 'Send OTP')
                        }
                    </button>
                )}

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-800"></div>
                    </div>
                </div>

                {mode === 'password' ? (
                    <div className="space-y-3">
                        {/* OTP Button Removed */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </button>
                    </div>
                ) : (
                    mode !== 'reset-final' && (
                        <button type="button" onClick={() => { setMode('password'); setError(''); }} className="w-full text-neutral-400 hover:text-white text-sm mt-4">
                            Back to Password Login
                        </button>
                    )
                )}

                {mode === 'password' && (
                    <p className="text-center text-neutral-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link href="/auth/register" className="text-red-500 hover:text-red-400 font-medium">
                            Sign up
                        </Link>
                    </p>
                )}
            </form>
        </AuthLayout>
    );
}

// Sub-component for Reset Password Form (Uses EMAIL and OTP now)
function ResetPasswordForm({ email, setError, setLoading, router }: { email: string, setError: (e: string) => void, setLoading: (l: boolean) => void, router: any }) {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await axios.post('/api/auth/reset-password', { email, otp, newPassword });
            alert('Password reset successful! Please login.');
            window.location.reload(); // back to login
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-neutral-900/50 p-3 rounded-lg mb-4 text-center">
                <p className="text-sm text-neutral-400">OTP sent to: <span className="text-white font-medium">{email}</span></p>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Enter OTP</label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors tracking-widest text-center"
                    placeholder="123456"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="Minimum 6 characters"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="Confirm new password"
                    required
                />
            </div>
            <button
                onClick={handleReset}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center uppercase tracking-wider text-sm mt-6"
            >
                Reset Password
            </button>
            <button type="button" onClick={() => window.location.reload()} className="w-full text-neutral-400 hover:text-white text-sm mt-4">
                Cancel
            </button>
        </div>
    );
}
