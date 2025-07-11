import React from 'react';
import CartItem from './CartItem';
import useCart from '../Hooks/useCartContext';
import { FaCartShopping } from "react-icons/fa6";

const CartView = () => {
    const { orders, loading, error } = useCart();

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-status-error">{error}</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <FaCartShopping className="text-primary-700 text-xl" />
                <h2 className="text-xl text-primary-700 font-bold font-inter">ORDER IN CART</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {!orders || orders.length === 0 ? (
                    <div className="text-center text-primary-500 py-8">
                        Your cart is empty
                    </div>
                ) : (
                    <div className="space-y-4 pr-4">
                        {orders.map((item, index) => (
                            <CartItem
                                key={index}
                                item={item}
                                orderIndex={index}
                                itemIndex={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartView;