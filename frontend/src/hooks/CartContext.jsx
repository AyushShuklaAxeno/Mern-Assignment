/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/api';

export const CartContext = createContext(null);

export const CartContextProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // Fetch server cart on mount or when user changes
    useEffect(() => {
        let isMounted = true;

        const syncWithServer = async () => {
            if (!user) {
                if (isMounted) {
                    setCartItems([]);
                }
                return;
            }

            try {
                const res = await api.get('/cart');
                if (isMounted && res.data?.success && Array.isArray(res.data.data?.items)) {
                    const serverItems = res.data.data.items.map(item => {
                        const prod = item.product || {};
                        const effectivePrice = (prod.discountPrice && Number(prod.discountPrice) > 0 && Number(prod.discountPrice) < Number(prod.price))
                            ? Number(prod.discountPrice)
                            : (Number(prod.price) || 0);

                        return {
                            productId: prod._id || prod,
                            name: prod.name || 'Product',
                            price: effectivePrice,
                            thumbnailImage: prod.thumbnailImage || '',
                            size: item.size,
                            color: '',
                            quantity: item.quantity,
                        };
                    });
                    setCartItems(serverItems);
                } else if (isMounted) {
                    setCartItems([]);
                }
            } catch {
                if (isMounted) {
                    setCartItems([]);
                }
            }
        };

        syncWithServer();
        return () => {
            isMounted = false;
        };
    }, [user]);

    const addToCart = useCallback(async ({ product, size, color, quantity = 1 }) => {
        if (!product || !size) return;

        const productId = product._id || product.id || product.productId;
        const normalizedSize = String(size).trim();
        const normalizedColor = color ? String(color).trim() : '';
        const qty = Math.max(1, Number(quantity) || 1);

        setCartItems(prev => {
            const existingIndex = prev.findIndex(
                item =>
                    item.productId === productId &&
                    item.size.toLowerCase() === normalizedSize.toLowerCase() &&
                    (!normalizedColor || item.color === normalizedColor)
            );

            if (existingIndex > -1) {
                const next = [...prev];
                next[existingIndex] = {
                    ...next[existingIndex],
                    quantity: next[existingIndex].quantity + qty,
                };
                return next;
            }

            const effectivePrice =
                product.discountPrice &&
                Number(product.discountPrice) > 0 &&
                Number(product.discountPrice) < Number(product.price)
                    ? Number(product.discountPrice)
                    : Number(product.price) || 0;

            return [
                ...prev,
                {
                    productId,
                    name: product.name,
                    price: effectivePrice,
                    thumbnailImage: product.thumbnailImage || '',
                    size: normalizedSize,
                    color: normalizedColor,
                    quantity: qty,
                },
            ];
        });

        // Sync with backend if user is logged in
        if (user) {
            try {
                await api.post('/cart', {
                    product_id: productId,
                    size: normalizedSize,
                    quantity: qty,
                });
            } catch (err) {
                console.error('Failed to sync added item with server', err);
            }
        }
    }, [user]);

    const removeFromCart = useCallback(async (productId, size, color) => {
        const normalizedSize = size ? String(size).trim() : '';

        setCartItems(prev =>
            prev.filter(
                item =>
                    !(
                        item.productId === productId &&
                        item.size.toLowerCase() === normalizedSize.toLowerCase() &&
                        (!color || item.color === color)
                    )
            )
        );

        if (user) {
            try {
                await api.delete(`/cart/item/${productId}`, {
                    data: { size: normalizedSize },
                    params: { size: normalizedSize },
                });
            } catch (err) {
                console.error('Failed to remove item from server cart', err);
            }
        }
    }, [user]);

    const increaseQuantity = useCallback(async (productId, size, color) => {
        const normalizedSize = size ? String(size).trim() : '';

        setCartItems(prev =>
            prev.map(item => {
                if (
                    item.productId === productId &&
                    item.size.toLowerCase() === normalizedSize.toLowerCase() &&
                    (!color || item.color === color)
                ) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        );

        if (user) {
            try {
                await api.patch(`/cart/item/${productId}/increase`, { size: normalizedSize });
            } catch (err) {
                console.error('Failed to increase item quantity on server', err);
            }
        }
    }, [user]);

    const decreaseQuantity = useCallback(async (productId, size, color) => {
        const normalizedSize = size ? String(size).trim() : '';

        const currentItem = cartItems.find(
            item =>
                item.productId === productId &&
                item.size.toLowerCase() === normalizedSize.toLowerCase() &&
                (!color || item.color === color)
        );

        if (!currentItem) return;

        if (currentItem.quantity <= 1) {
            await removeFromCart(productId, size, color);
            return;
        }

        setCartItems(prev =>
            prev.map(item => {
                if (
                    item.productId === productId &&
                    item.size.toLowerCase() === normalizedSize.toLowerCase() &&
                    (!color || item.color === color)
                ) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            })
        );

        if (user) {
            try {
                await api.patch(`/cart/item/${productId}/decrease`, { size: normalizedSize });
            } catch (err) {
                console.error('Failed to decrease item quantity on server', err);
            }
        }
    }, [cartItems, removeFromCart, user]);

    const updateQuantity = useCallback(async (productId, size, color, newQuantity) => {
        const qty = Number(newQuantity);
        const currentItem = cartItems.find(
            item =>
                item.productId === productId &&
                item.size.toLowerCase() === size?.toLowerCase() &&
                (!color || item.color === color)
        );

        if (!currentItem) return;

        if (qty <= 0) {
            await removeFromCart(productId, size, color);
            return;
        }

        if (qty > currentItem.quantity) {
            await increaseQuantity(productId, size, color);
        } else if (qty < currentItem.quantity) {
            await decreaseQuantity(productId, size, color);
        }
    }, [cartItems, removeFromCart, increaseQuantity, decreaseQuantity]);

    const clearCart = useCallback(async () => {
        setCartItems([]);
        if (user) {
            try {
                await api.delete('/cart/clear-cart');
            } catch (err) {
                console.error('Failed to clear cart on server', err);
            }
        }
    }, [user]);

    const cartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
    const cartSubtotal = cartItems.reduce(
        (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                updateQuantity,
                clearCart,
                cartCount,
                cartSubtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
};

export default CartContext;
