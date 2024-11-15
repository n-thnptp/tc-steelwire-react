import { createContext, useState, useEffect } from 'react';
import useLoginContext from '../Hooks/useLoginContext';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useLoginContext();

    // Load orders inside cart
    useEffect(() => {
        const fetchItems = async () => {
            if (!user) return; // Don't fetch if user isn't logged in

            try {
                setLoading(true);
                const response = await fetch('/api/order/retrieve_cart', {
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.success) {
                    setOrders(data.items);
                } else {
                    setError(data.message || "Failed to fetch items");
                }
            } catch (error) {
                setError("Failed to fetch items. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [user]);

    const removeItem = async (orderIndex, itemIndex) => {
        try {
            await fetch('/api/order/remove_cart_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    product_id: orders[orderIndex].p_id
                })
            });

            // Update local state after successful API call
            setOrders(prevOrders => {
                return prevOrders.filter((_, index) => index !== orderIndex);
            });
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const addToFavorites = (orderIndex, itemIndex) => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const item = orders[orderIndex].items[itemIndex];

        // Check if item is already in favorites
        const isAlreadyFavorite = favorites.some(
            fav => fav.product === item.product &&
                fav.steelSize === item.steelSize &&
                fav.length === item.length
        );

        if (!isAlreadyFavorite) {
            favorites.push(item);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    };

    const updateShippingAddress = async (address) => {
        try {
            setLoading(true);
            // Here you would typically make an API call to update the shipping address
            // For now, we'll just store it in localStorage
            localStorage.setItem('shippingAddress', JSON.stringify(address));
            setLoading(false);
        } catch (err) {
            setError('Failed to update shipping address');
            setLoading(false);
        }
    };

    const getShippingAddress = () => {
        return JSON.parse(localStorage.getItem('shippingAddress')) || null;
    };

    const clearCart = () => {
        setOrders([]);
        localStorage.removeItem('orders');
    };

    return (
        <CartContext.Provider
            value={{
                orders,
                loading,
                error,
                removeItem,
                addToFavorites,
                updateShippingAddress,
                getShippingAddress,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;