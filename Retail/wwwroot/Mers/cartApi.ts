
export const API_URL = '/api';

export const getHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const sessionId = localStorage.getItem('cart_session_id');
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const fetchCart = async () => {
    const res = await fetch(`${API_URL}/koszyk`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
};

export const addToCart = async (productId: number, quantity: number = 1) => {
    const res = await fetch(`${API_URL}/koszyk/dodaj`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ produktId: productId, ilosc: quantity }),
    });
    if (!res.ok) {
        const err = await res.text();
        console.error('AddToCart Error:', res.status, err);
        throw new Error(`Failed to add to cart: ${res.status} ${err}`);
    }
    return res.json();
};

export const updateCartItem = async (koszykId: number, pozycjaId: number, quantity: number) => {
    const res = await fetch(`${API_URL}/koszyk/aktualizuj`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ koszykId, pozycjaId, nowaIlosc: quantity }),
    });
    if (!res.ok) throw new Error('Failed to update cart item');
};

export const removeCartItem = async (koszykId: number, pozycjaId: number) => {
    const res = await fetch(`${API_URL}/koszyk/${koszykId}/pozycja/${pozycjaId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove item');
};
