import { API_URL, getHeaders } from './authApi';

export const fetchCart = async () => {
    const res = await fetch(`${API_URL}/cart`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
};

export const addToCart = async (productId: number, quantity: number = 1) => {
    const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) {
        const err = await res.text();
        console.error('AddToCart Error:', res.status, err);
        throw new Error(`Failed to add to cart: ${res.status} ${err}`);
    }
    return res.json();
};

export const updateCartItem = async (
    cartId: number,
    cartItemId: number,
    quantity: number
) => {
    const res = await fetch(`${API_URL}/cart/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ cartId, cartItemId, newQuantity: quantity }),
    });
    if (!res.ok) throw new Error('Failed to update cart item');
};

export const removeCartItem = async (cartId: number, cartItemId: number) => {
    const res = await fetch(`${API_URL}/cart/${cartId}/item/${cartItemId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove item');
};

export const mergeCart = async (sessionId: string) => {
    const res = await fetch(`${API_URL}/cart/merge`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) {
        console.error('MergeCart Error:', res.status);
        throw new Error('Failed to merge cart');
    }
    return res.json();
};