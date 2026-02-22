import { useState, useEffect } from 'react';
import { UserProfile } from '../api/types';

const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const mapRole = (backendRole: string): 'admin' | 'customer' | 'employee' | 'shipper' | 'supplier' => {
    switch (backendRole?.toLowerCase()) {
        case 'admin': return 'admin';
        case 'employee': return 'employee';
        case 'supplier': return 'supplier';
        case 'shipper': return 'shipper';
        default: return 'customer';
    }
};

export function useAuth() {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
        try {
            const cached = sessionStorage.getItem('currentUser');
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const cached = sessionStorage.getItem('currentUser');
        if (token && !cached) {
            fetch('/api/customer/me', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        sessionStorage.removeItem('token');
                        return null;
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data) {
                        setCurrentUser({
                            id: String(data.id),
                            name: data.firstName && data.lastName
                                ? `${data.firstName} ${data.lastName}`
                                : data.firstName || 'User',
                            email: data.email,
                            role: mapRole(data.role || 'customer'),
                        });
                    }
                })
                .catch(() => {
                    sessionStorage.removeItem('token');
                });
        }
    }, []);

    useEffect(() => {
        let sessionId = sessionStorage.getItem('cart_session_id');
        if (!sessionId) {
            sessionId = generateUUID();
            sessionStorage.setItem('cart_session_id', sessionId);
        }
    }, []);

    const handleLogin = (user: UserProfile) => {
        setCurrentUser(user);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/Auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            console.error('Logout API call failed', err);
        }

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('cart_session_id');

        const newSessionId = generateUUID();
        sessionStorage.setItem('cart_session_id', newSessionId);

        setCurrentUser(null);
    };

    return { currentUser, setCurrentUser, handleLogin, handleLogout };
}
