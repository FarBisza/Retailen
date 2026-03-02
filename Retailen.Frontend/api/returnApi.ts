import { API_URL, getHeaders } from './authApi';
import type { PagedResponse } from './adminApi';

export interface ReturnDTO {
    returnId: number;
    orderId: number;
    customerId: number;
    customerEmail?: string;
    customerFirstName?: string;
    returnStatusId: number;
    statusName?: string;
    orderItemId?: number;
    productName?: string;
    quantity: number;
    reason: string;
    description?: string;
    refundAmount: number;
    approvedDate?: string;
    returnDate?: string;
    adminNote?: string;
    createdAt: string;
}

export interface CreateReturnRequest {
    orderId: number;
    orderItemId?: number;
    quantity?: number;
    reason: string;
    description?: string;
}

export interface UpdateReturnStatusRequest {
    returnStatusId: number;
    refundAmount?: number;
    adminNote?: string;
}

export const RETURN_STATUS = {
    1: { name: 'Pending', color: 'yellow' },
    2: { name: 'Approved', color: 'green' },
    3: { name: 'Rejected', color: 'red' },
    4: { name: 'Refund Completed', color: 'blue' },
    5: { name: 'Cancelled', color: 'gray' },
} as const;

export const getAllReturns = async (): Promise<ReturnDTO[]> => {
    try {
        const res = await fetch(`${API_URL}/return`, {
            headers: getHeaders(),
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching returns:', error);
        return [];
    }
};

export const getAllReturnsPaged = async (skip: number, take: number): Promise<PagedResponse<ReturnDTO>> => {
    const page = Math.floor(skip / take) + 1;
    const pageSize = take;
    const res = await fetch(`${API_URL}/return?page=${page}&pageSize=${pageSize}`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch returns');
    return res.json();
};

export const getReturnsByStatus = async (
    statusId: number
): Promise<ReturnDTO[]> => {
    try {
        const res = await fetch(`${API_URL}/return/status/${statusId}`, {
            headers: getHeaders(),
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching returns by status:', error);
        return [];
    }
};

export const getMyReturns = async (): Promise<ReturnDTO[]> => {
    try {
        const res = await fetch(`${API_URL}/return/my`, {
            headers: getHeaders(),
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching my returns:', error);
        return [];
    }
};

export const createReturn = async (
    data: CreateReturnRequest
): Promise<ReturnDTO | null> => {
    try {
        const res = await fetch(`${API_URL}/return`, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Error creating return:', error);
        return null;
    }
};

export const updateReturnStatus = async (
    id: number,
    data: UpdateReturnStatusRequest
): Promise<ReturnDTO | null> => {
    try {
        const res = await fetch(`${API_URL}/return/${id}/status`, {
            method: 'PUT',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Error updating return status:', error);
        return null;
    }
};

export const cancelReturn = async (id: number): Promise<boolean> => {
    try {
        const res = await fetch(`${API_URL}/return/${id}/cancel`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return res.ok;
    } catch (error) {
        console.error('Error canceling return:', error);
        return false;
    }
};