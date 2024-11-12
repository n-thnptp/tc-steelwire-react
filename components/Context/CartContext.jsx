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

                console.log("here: " + JSON.stringify(data));

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
            console.log(orders);
            console.log("Order index: " + orderIndex);
            console.log("Item index: " + itemIndex);
            console.log("product_id = " + JSON.stringify(orders[orderIndex].p_id));
            console.log("USER ID: " + user.id);
            await fetch('/api/order/remove_cart_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    product_id: orders[orderIndex].p_id
                })
            })
        } catch (error) {
            console.error("Error removing item:", error);
        }

        setOrders(prevOrders => {
            const newOrders = [...prevOrders];
            const order = { ...newOrders[orderIndex] };

            console.log(order);
            // // Remove the specific item
            // order.items = order.items.filter((_, index) => index !== itemIndex);

            // // Recalculate total weight
            // order.currentWeight = order.items.reduce(
            //     (total, item) => total + (parseFloat(item.weight) || 0),
            //     0
            // );

            // // If order is empty, remove it entirely
            // if (order.items.length === 0) {
            //     newOrders.splice(orderIndex, 1);
            // } else {
            //     newOrders[orderIndex] = order;
            // }

            // return newOrders;
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