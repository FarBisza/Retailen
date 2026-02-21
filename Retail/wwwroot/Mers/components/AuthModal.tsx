
import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, ArrowRight, Phone, MapPin, Globe } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const sessionId = localStorage.getItem('cart_session_id');
            const response = await fetch('/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    sessionId // Send Session ID for merging
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save token
            localStorage.setItem('token', data.accessToken); // Assuming response has accessToken
            // Close modal
            onClose();
            alert('Logged in successfully!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-white rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 text-gray-400 hover:text-black transition-colors z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-12">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                            {mode === 'login' ? 'Enter your details to sign in' : 'Join the mers community'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-sm text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={mode === 'login' ? handleLogin : (e) => e.preventDefault()}>
                        {mode === 'register' ? (
                            <>
                                {/* Registration Inputs (Impl later) */}
                                <div className="text-center text-gray-400 text-sm">Registration logic not implemented in this demo</div>
                            </>
                        ) : (
                            /* Login Mode */
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="hello@example.com"
                                            className="w-full bg-gray-50 border border-transparent focus:border-slate-900 focus:bg-white px-11 py-3.5 text-sm rounded-sm transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                                        <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Forgot?</button>
                                    </div>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-50 border border-transparent focus:border-slate-900 focus:bg-white px-11 py-3.5 text-sm rounded-sm transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0c121e] text-white py-4 font-bold text-xs rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase tracking-widest mt-4 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    {mode === 'login' && (
                        <div className="mt-8">
                            {/* Social Login Buttons Omitted for brevity */}
                        </div>
                    )}

                    <div className="mt-8 text-center border-t border-gray-50 pt-6">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                        >
                            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-gray-200 font-bold uppercase tracking-widest">
                        <ShieldCheck size={12} />
                        Secure & Encrypted Connection
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
