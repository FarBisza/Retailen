import { API_URL, getHeaders } from './authApi';

export interface CustomerProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    zipCode: string | null;
    country: string | null;
    role: string | null;
    registeredAt: string | null;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    country?: string;
}

export const getMyProfile = async (): Promise<CustomerProfile> => {
    const res = await fetch(`${API_URL}/customer/me`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
};

export const updateMyProfile = async (data: UpdateProfileRequest): Promise<CustomerProfile> => {
    const res = await fetch(`${API_URL}/customer/me`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
};
