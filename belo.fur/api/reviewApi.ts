// ============================================================
// reviewApi.ts — Product review operations (English)
// ============================================================

import { Review } from './types';

export const submitReview = async (
    productId: string,
    rating: number,
    comment: string
): Promise<Review> => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        throw new Error('User not authenticated');
    }

    const response = await fetch(`/api/product/${productId}/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            rating,
            content: comment,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
    }

    const data = await response.json();

    return {
        id: data.id.toString(),
        userId: data.customerId?.toString() || '',
        userName: data.title || 'Anonymous',
        rating: data.rating,
        comment: data.content,
        date: new Date(data.createdAt).toISOString().split('T')[0],
    };
};