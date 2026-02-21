// ============================================================
// adminApi.ts — Admin operations (English)
// ============================================================

import { API_URL, getHeaders } from './authApi';

export interface PagedResponse<T> {
    items: T[];
    totalCount: number;
}

export interface AdminOrder {
    id: number;
    status: string;
    statusId: number;
    orderDate: string;
    totalAmount: number;
    customerId: number;
    shippingAddress: {
        fullName: string;
        email: string;
        phoneNumber: string;
        streetAddress: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    } | null;
    items: {
        productName: string;
        quantity: number;
        unitPrice: number;
        imageUrl: string | null;
    }[];
    delivery: {
        trackingNumber: string | null;
        carrier: string | null;
    } | null;
}

export const getAllOrders = async (): Promise<AdminOrder[]> => {
    const res = await fetch(`${API_URL}/order/all`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const raw: any[] = await res.json();
    return raw.map(mapRawOrder);
};

const mapRawOrder = (o: any): AdminOrder => ({
    id: o.id,
    status: o.status,
    statusId: o.statusId,
    orderDate: o.orderDate,
    totalAmount: o.total ?? o.totalAmount ?? 0,
    customerId: o.customerId ?? 0,
    shippingAddress: o.shippingAddress ?? null,
    items: (o.items || []).map((item: any) => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        imageUrl: item.imageUrl ?? null,
    })),
    delivery: o.shipment ? {
        trackingNumber: o.shipment.trackingNumber ?? null,
        carrier: o.shipment.carrier ?? null,
    } : (o.delivery ?? null),
});

export const getAllOrdersPaged = async (skip: number, take: number): Promise<PagedResponse<AdminOrder>> => {
    const res = await fetch(`${API_URL}/order/all?skip=${skip}&take=${take}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return {
        items: (data.items || []).map(mapRawOrder),
        totalCount: data.totalCount,
    };
};

export const shipOrder = async (
    orderId: number,
    carrier: string,
    trackingNumber: string
) => {
    const res = await fetch(`${API_URL}/order/${orderId}/ship`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ carrier, trackingNumber }),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Shipping failed: ${err}`);
    }
    return res.json();
};

export const startProcessing = async (orderId: number) => {
    const res = await fetch(`${API_URL}/order/${orderId}/process`, {
        method: 'POST',
        headers: getHeaders(),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Start processing failed: ${err}`);
    }
    return res.json();
};

export const deliverOrder = async (orderId: number) => {
    const res = await fetch(`${API_URL}/order/${orderId}/deliver`, {
        method: 'POST',
        headers: getHeaders(),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Delivery failed: ${err}`);
    }
    return res.json();
};

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
    role: string;
    isActive: boolean;
}

export const getAllUsers = async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/customer`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
};

export const getAllUsersPaged = async (skip: number, take: number): Promise<PagedResponse<User>> => {
    const res = await fetch(`${API_URL}/customer?skip=${skip}&take=${take}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
};

export const setUserActive = async (userId: number, isActive: boolean) => {
    const res = await fetch(`${API_URL}/customer/${userId}/set-active`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ isActive }),
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return res.json();
};

export const setUserRole = async (userId: number, roleId: number) => {
    const res = await fetch(`${API_URL}/customer/${userId}/set-role`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ roleId }),
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json();
};

export const updateUser = async (userId: number, data: Partial<User>) => {
    const res = await fetch(`${API_URL}/customer/${userId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
};

export const deleteUser = async (userId: number) => {
    const res = await fetch(`${API_URL}/customer/${userId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete user');
};

export interface InvoiceData {
    invoiceId: number;
    orderId: number;
    amount: number;
    issuedDate: string;
    statusId: number;
    statusName: string;
    billingInfo?: {
        companyName?: string;
        taxId?: string;
        address?: string;
    };
}

export const getInvoice = async (orderId: number): Promise<InvoiceData | null> => {
    const res = await fetch(`${API_URL}/order/${orderId}/invoice`, {
        headers: getHeaders(),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch invoice');
    return res.json();
};