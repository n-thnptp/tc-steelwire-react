import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCart from '../Hooks/useCartContext';

const PurchaseSummary = () => {
    const router = useRouter();
    const { orders, loading, clearCart } = useCart();
    const [shippingFee, setShippingFee] = useState(3500);

    useEffect(() => {
        const fetchUserAddress = async () => {
            try {
                const response = await fetch('/api/user/shipping-address', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (data.success) {
                    const isFreeShippingZone = [1, 2, 3, 4, 58, 59].includes(data.province_id);
                    setShippingFee(isFreeShippingZone ? 0 : 3500);
                }
            } catch (error) {
                console.error('Error fetching shipping address:', error);
            }
        };

        fetchUserAddress();
    }, []);

    const calculateTotal = () => {
        if (!orders || orders.length === 0) return 0;
        return orders.reduce((sum, order) => sum + order.total_price, 0) + shippingFee;
    };

    const isCartEmpty = !orders || orders.length === 0;

    const handleConfirm = async () => {
        try {
            console.log('Starting order creation...');
            // Calculate total price including shipping
            const totalPrice = orders.reduce((sum, order) => sum + order.total_price, 0) + shippingFee;
            
            const response = await fetch('/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total_price: totalPrice,
                    shipping_fee: shippingFee
                })
            });

            const data = await response.json();
            console.log('Order creation response:', data);

            if (data.success) {
                // Redirect to payment page WITH orderId
                router.push(`/payment/${data.orderId}`);
            } else {
                throw new Error(data.message || 'Failed to create order');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order: ' + error.message);
        }
    };

    return (
        <div className="bg-neutral-white p-6 rounded-lg">
            <div className="bg-neutral-white rounded-lg">
                <h2 className="text-2xl font-bold text-primary-700 font-inter mb-6">SUMMARY</h2>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-primary-700 font-inter font-bold">SHIPPING FEE</p>
                        <p className="text-primary-700 font-bold font-inter">
                            {shippingFee === 0 ? 'FREE' : `${shippingFee.toFixed(2)} BAHT`}
                        </p>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <p className="text-primary-700 font-inter font-bold">TOTAL</p>
                        <p className="text-primary-700 font-bold font-inter">
                            {calculateTotal().toFixed(2)} BAHT
                        </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-gray-200 space-y-3">
                        <button
                            className={`w-full primary-buttons ${isCartEmpty && 'disabled'}`}
                            onClick={handleConfirm}
                            disabled={isCartEmpty || loading}
                        >
                            CONFIRM
                        </button>
                        <button 
                            className="w-full secondary-buttons"
                            onClick={() => router.push('/order')}
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseSummary;