// ============================================================
// returnApi.ts — Returns operations (English)
// ============================================================

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

// Status enum for UI
export const RETURN_STATUS = {
    1: { name: 'Pending', color: 'yellow' },
    2: { name: 'Approved', color: 'green' },
    3: { name: 'Rejected', color: 'red' },
    4: { name: 'Refund Completed', color: 'blue' },
    5: { name: 'Cancelled', color: 'gray' },
} as const;

/**
 * Get all returns (Staff/Admin only)
 */
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
    const res = await fetch(`${API_URL}/return?skip=${skip}&take=${take}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch returns');
    return res.json();
};

/**
 * Get returns by status
 */
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

/**
 * Get my returns (authenticated user)
 */
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

/**
 * Create a return request
 */
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

/**
 * Update return status (Staff/Admin)
 */
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

/**
 * Cancel my return request
 */
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