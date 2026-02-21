// ============================================================
// orderApi.ts — Customer order operations (English)
// ============================================================

import { API_URL, getHeaders } from './authApi';

export interface CheckoutResponse {
    orderId: number;
    total: number;
}

export interface PayRequest {
    paymentTypeId: number;
    amount: number;
    warehouseId?: number;
}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    imageUrl: string | null;
}

export interface ShipmentInfo {
    trackingNumber: string | null;
    carrier: string | null;
    shippedDate: string | null;
    deliveredDate: string | null;
    shipmentStatusId: number;
}

export interface ShippingAddress {
    email?: string;
    fullName: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    country: string;
}

export interface Order {
    id: number;
    statusId: number;
    status: string;
    orderDate: string;
    total: number;
    items: OrderItem[];
    shipment: ShipmentInfo | null;
    shippingAddress?: ShippingAddress;
    estimatedDeliveryDate?: string;
    hasInvoice?: boolean;
}

// ... existing code ...
export interface CheckoutAddress {
    email?: string;
    fullName: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
    phoneNumber?: string;
}

export interface BillingInfoRequest {
    buyerName?: string;
    taxId?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    email?: string;
}

export const checkout = async (address?: CheckoutAddress): Promise<CheckoutResponse> => {
    const res = await fetch(`${API_URL}/order/checkout`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(address || {}),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(
            `Checkout failed: ${res.status} ${res.statusText} ${err}`
        );
    }
    return res.json();
};

export const requestInvoice = async (orderId: number, req: BillingInfoRequest): Promise<void> => {
    const res = await fetch(`${API_URL}/order/${orderId}/request-invoice`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Invoice request failed: ${err}`);
    }
};

export const payOrder = async (orderId: number, req: PayRequest) => {
    // ... existing code ...
    const res = await fetch(`${API_URL}/order/${orderId}/pay`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Payment failed: ${err}`);
    }
    return res.json();
};

export const getMyOrders = async (): Promise<Order[]> => {
    const res = await fetch(`${API_URL}/order`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
};

export interface OrderCounts {
    toPay: number;
    toShip: number;
    shipped: number;
    toReview: number;
    returns: number;
}

export const getOrderCounts = async (): Promise<OrderCounts> => {
    const res = await fetch(`${API_URL}/order/counts`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch order counts');
    return res.json();
};

export interface InvoiceData {
    id: number;
    orderId: number;
    invoiceStatusId: number | null;
    issuedDate: string | null;
    amount: number | null;
    statusId?: number | null;
    statusName?: string;
    // Billing data
    buyerName?: string | null;
    taxId?: string | null;
    billingAddress?: string | null;
    billingCity?: string | null;
    billingZipCode?: string | null;
    billingCountry?: string | null;
    billingEmail?: string | null;
}

export const getInvoice = async (orderId: number): Promise<InvoiceData> => {
    const res = await fetch(`${API_URL}/order/${orderId}/invoice`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('No invoice found for this order');
    return res.json();
};