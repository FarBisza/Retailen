import React, { useState, useEffect } from 'react';
import {
    X,
    ShieldCheck,
    Mail,
    Lock,
    User,
    ArrowRight,
    Phone,
    CheckCircle,
} from 'lucide-react';
import { UserProfile } from '../../api/types';
import { API_URL } from '../../api/authApi';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: UserProfile) => void;
    initialMode?: 'login' | 'register';
    onForgotPassword?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    onLogin,
    initialMode = 'login',
    onForgotPassword,
}) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const sessionId = sessionStorage.getItem('cart_session_id');
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    sessionId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            sessionStorage.setItem('token', data.accessToken);

            if (sessionId) {
                sessionStorage.removeItem('cart_session_id');
            }

            const mapRole = (
                backendRole: string
            ): 'admin' | 'customer' | 'employee' | 'shipper' | 'supplier' => {
                switch (backendRole?.toLowerCase()) {
                    case 'admin':
                        return 'admin';
                    case 'employee':
                        return 'employee';
                    case 'supplier':
                        return 'supplier';
                    case 'customer':
                    default:
                        return 'customer';
                }
            };

            onLogin({
                id: String(data.id),
                name:
                    data.firstName && data.lastName
                        ? `${data.firstName} ${data.lastName}`
                        : data.firstName || 'User',
                email: data.email || email,
                role: mapRole(data.role),
            });
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    phone,
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
            }

            if (!response.ok) {
                let errorMessage = data.message || 'Registration failed';

                if (data.errors) {
                    const firstError = Object.values(data.errors).flat()[0];
                    if (firstError) {
                        errorMessage = String(firstError);
                    }
                }

                throw new Error(errorMessage);
            }

            setRegistrationSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhone('');
        setError(null);
        setRegistrationSuccess(false);
    };

    const switchMode = (newMode: 'login' | 'register') => {
        resetForm();
        setMode(newMode);
    };

    if (!isOpen) return null;

    if (registrationSuccess) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
                <div className="relative w-full max-w-xl bg-white rounded-none sm:rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-1 text-gray-400 hover:text-black transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 md:p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">
                            Check Your Email
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We've sent a confirmation link to <strong>{email}</strong>
                            . Please check your inbox and click the link to verify
                            your account.
                        </p>
                        <p className="text-sm text-gray-400 mb-8">
                            Didn't receive the email? Check your spam folder or try
                            registering again.
                        </p>
                        <button
                            onClick={() => switchMode('login')}
                            className="w-full bg-[#0c121e] text-white py-4 font-bold text-xs rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                        >
                            Go to Login
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl bg-white rounded-none sm:rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 text-gray-400 hover:text-black transition-colors z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-6 sm:p-8 md:p-12">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                            {mode === 'login'
                                ? 'Enter your details to sign in'
                                : 'Join the community'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-sm text-center">
                            {error}
                        </div>
                    )}

                    <form
                        className="space-y-4"
                        onSubmit={mode === 'login' ? handleLogin : handleRegister}
                    >
                        {mode === 'register' ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <User
                                            size={16}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                        />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            className="w-full bg-gray-50 border border-transparent focus:border-slate-900 focus:bg-white px-11 py-3.5 text-sm rounded-sm transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <User
                                            size={16}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                        />
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            className="w-full bg-gray-50 border border-transparent focus:border-slate-900 focus:bg-white px-11 py-3.5 text-sm rounded-sm transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={16}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                        />
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
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            size={16}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                        />
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

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                        Phone (optional)
                                    </label>
                                    <div className="relative">
                                        <Phone
                                            size={16}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                        />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+1 555 123 4567"
                                            className="w-full bg-gray-50 border border-transparent focus:border-slate-900 focus:bg-white px-11 py-3.5 text-sm rounded-sm transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={16}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                        />
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
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={onForgotPassword}
                                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                                        >
                                            Forgot?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock
                                            size={16}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                        />
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
                            {loading
                                ? 'Processing...'
                                : mode === 'login'
                                    ? 'Sign In'
                                    : 'Create Account'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-50 pt-6">
                        <button
                            onClick={() =>
                                switchMode(mode === 'login' ? 'register' : 'login')
                            }
                            className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                        >
                            {mode === 'login'
                                ? "Don't have an account? Sign Up"
                                : 'Already have an account? Sign In'}
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