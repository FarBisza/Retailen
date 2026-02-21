// ============================================================
// authApi.ts — Shared authentication utilities
// ============================================================

export const API_URL = '/api';

export const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const sessionId = sessionStorage.getItem('cart_session_id');
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    const token = sessionStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Forgot Password
export const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset link');
    }

    return await response.json();
};

// Reset Password
export const resetPassword = async (data: any) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
    }

    return await response.json();
};
