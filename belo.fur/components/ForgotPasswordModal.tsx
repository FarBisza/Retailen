import React, { useState } from 'react';
import { X, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { forgotPassword } from '../api/authApi';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToLogin: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    isOpen,
    onClose,
    onBackToLogin,
}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
                <div className="relative w-full max-w-xl bg-white rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
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
                            If an account exists for <strong>{email}</strong>, we've sent instructions to reset your password.
                        </p>
                        <button
                            onClick={() => {
                                setSuccess(false);
                                setEmail('');
                                onClose();
                            }}
                            className="w-full bg-[#0c121e] text-white py-4 font-bold text-xs rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl bg-white rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 text-gray-400 hover:text-black transition-colors z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-12">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                            Reset Password
                        </h2>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                            Enter your email to receive reset instructions
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-sm text-center flex items-center justify-center gap-2">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                Email Address
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0c121e] text-white py-4 font-bold text-xs rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-50 pt-6">
                        <button
                            onClick={onBackToLogin}
                            className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
