import { createContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load orders from localStorage on mount
    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        setOrders(savedOrders);
    }, []);

    // Save orders to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    const removeItem = (orderIndex, itemIndex) => {
        setOrders(prevOrders => {
            const newOrders = [...prevOrders];
            const order = { ...newOrders[orderIndex] };

            // Remove the specific item
            order.items = order.items.filter((_, index) => index !== itemIndex);

            // Recalculate total weight
            order.currentWeight = order.items.reduce(
                (total, item) => total + (parseFloat(item.weight) || 0),
                0
            );

            // If order is empty, remove it entirely
            if (order.items.length === 0) {
                newOrders.splice(orderIndex, 1);
            } else {
                newOrders[orderIndex] = order;
            }

            return newOrders;
        });
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