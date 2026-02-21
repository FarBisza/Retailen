import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '../../api/authApi';

interface ResetPasswordPageProps {
    onNavigateToLogin: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigateToLogin }) => {
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Parse query params from URL
        const params = new URLSearchParams(window.location.search);
        const tokenParam = params.get('token');
        const emailParam = params.get('email');

        if (tokenParam) setToken(tokenParam);
        if (emailParam) setEmail(emailParam);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            await resetPassword({
                token,
                email,
                newPassword,
                confirmPassword // API expects this
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pt-24 relative z-10">
                <div className="w-full max-w-md bg-white rounded-sm shadow-xl p-8 md:p-12 text-center animate-in fade-in zoom-in duration-300 border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">
                        Password Reset Successful
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Your password has been updated. You can now sign in with your new credentials.
                    </p>
                    <button
                        onClick={onNavigateToLogin}
                        className="w-full bg-[#0c121e] text-white py-4 font-bold text-xs rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        Go to Login
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        );
    }

    if (!token || !email) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pt-24 relative z-10">
                <div className="w-full max-w-md bg-white rounded-sm shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Link</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        The reset link is invalid or missing required information.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="text-xs font-bold uppercase tracking-widest text-[#0c121e] hover:underline"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pt-24 relative z-10">
            <div className="w-full max-w-md bg-white rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-gray-100">
                <div className="p-8 md:p-12">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                            Set New Password
                        </h2>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                            Create a strong password for your account
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-sm text-center flex items-center justify-center gap-2">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* New Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-transparent focus:border-slate-900 focus:bg-white px-11 py-3.5 text-sm rounded-sm transition-all outline-none"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
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
                            {loading ? 'Resetting...' : 'Reset Password'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
