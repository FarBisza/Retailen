import { useState, useEffect } from 'react';
import { CartItem, Product, UserProfile } from '../api/types';

export function useCart(currentUser: UserProfile | null) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Fetch Cart from Backend on load and when user changes (login/logout)
    useEffect(() => {
        const loadCart = async () => {
            try {
                const { fetchCart } = await import('../api/cartApi');
                const cartData = await fetchCart();

                if (cartData && cartData.items) {
                    const mappedItems: CartItem[] = cartData.items.map((p: any) => ({
                        id: p.productId.toString(),
                        name: p.productName,
                        price: p.unitPrice,
                        quantity: p.quantity,
                        image: p.imageUrl,
                        category: 'Furniture',
                        style: 'Modern',
                        colors: [],
                        inStock: true,
                        cartId: cartData.id,
                        cartItemId: p.id
                    }));
                    setCartItems(mappedItems);
                }
            } catch (error) {
                console.error('Failed to sync cart:', error);
            }
        };
        loadCart();
    }, [currentUser]);

    const addToCart = async (product: Product, quantity: number = 1) => {
        try {
            const { addToCart: addToCartAPI } = await import('../api/cartApi');
            await addToCartAPI(parseInt(product.id), quantity);

            setCartItems(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) {
                    return prev.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                    );
                }
                return [...prev, {
                    ...product,
                    quantity,
                    cartId: 0,
                    cartItemId: 0
                }];
            });

            return true; // signal success so caller can open drawer
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('Failed to add item to cart. Please try again.');
            return false;
        }
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) return;

        // Optimistic Update
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));

        const itemToUpdate = cartItems.find(item => item.id === id);
        if (!itemToUpdate) return;

        if (itemToUpdate.cartId && itemToUpdate.cartItemId) {
            try {
                const { updateCartItem } = await import('../api/cartApi');
                await updateCartItem(itemToUpdate.cartId, itemToUpdate.cartItemId, quantity);
            } catch (error) {
                console.error("Failed to update quantity", error);
            }
        } else {
            try {
                const mapCartToItems = (data: any): CartItem[] => {
                    if (!data || !data.items) return [];
                    return data.items.map((p: any) => ({
                        id: p.productId.toString(),
                        name: p.productName,
                        price: p.unitPrice,
                        quantity: p.quantity,
                        image: p.imageUrl,
                        category: 'Furniture',
                        style: 'Modern',
                        colors: [],
                        inStock: true,
                        cartId: data.id,
                        cartItemId: p.id
                    }));
                };

                const { fetchCart, updateCartItem } = await import('../api/cartApi');
                const cartData = await fetchCart();

                if (cartData && cartData.items) {
                    const freshItem = cartData.items.find((p: any) => p.productId.toString() === id);
                    if (freshItem) {
                        await updateCartItem(cartData.id, freshItem.id, quantity);
                        setCartItems(prev => prev.map(item =>
                            item.id === id ? { ...item, cartId: cartData.id, cartItemId: freshItem.id } : item
                        ));
                    }
                }
            } catch (error) {
                console.error("Failed to sync and update quantity", error);
            }
        }
    };

    return { cartItems, setCartItems, addToCart, removeFromCart, updateQuantity };
}
