import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCart from '../Hooks/useCartContext';

const PurchaseSummary = () => {
    const router = useRouter();
    const { orders, loading, clearCart } = useCart();
    const [shippingFee, setShippingFee] = useState(0);
    const [loadingAddress, setLoadingAddress] = useState(true);

    useEffect(() => {
        const fetchShippingDetails = async () => {
            try {
                setLoadingAddress(true);
                const addressResponse = await fetch('/api/user/shipping-address', {
                    credentials: 'include'
                });
                
                const addressData = await addressResponse.json();
                console.log('Address data:', addressData);
                
                if (!addressData.success || !addressData.address) {
                    throw new Error(addressData.message || 'Failed to fetch address');
                }

                const { tambon_name, amphur_name, province_name } = addressData.address;

                if (!tambon_name || !amphur_name || !province_name) {
                    console.error('Missing address components:', addressData.address);
                    throw new Error('Incomplete address information');
                }

                const searchTerm = `ตำบล${tambon_name} อำเภอ${amphur_name} จังหวัด${province_name}`;
                console.log('Search term:', searchTerm);

                const shippingResponse = await fetch('/api/shipping-calculator', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ searchTerm })
                });

                if (!shippingResponse.ok) {
                    throw new Error('Failed to calculate shipping');
                }
                
                const shippingData = await shippingResponse.json();
                if (shippingData.success) {
                    setShippingFee(shippingData.shippingFee);
                } else {
                    throw new Error(shippingData.message || 'Failed to calculate shipping fee');
                }
            } catch (error) {
                console.error('Error details:', error);
                alert('Failed to calculate shipping fee. Please try again.');
            } finally {
                setLoadingAddress(false);
            }
        };

        fetchShippingDetails();
    }, []);

    const calculateSubtotal = () => {
        if (!orders || orders.length === 0) return 0;
        return orders.reduce((sum, order) => sum + order.total_price, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + shippingFee;
    };

    const isCartEmpty = !orders || orders.length === 0;

    const handleConfirm = async () => {
        try {
            const subtotal = calculateSubtotal();
            const totalPrice = calculateTotal();
            
            const response = await fetch('/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subtotal: subtotal,
                    total_price: totalPrice,
                    shipping_fee: shippingFee
                })
            });

            const data = await response.json();

            if (data.success) {
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
                        <p className="text-primary-700 font-inter font-bold">SUBTOTAL</p>
                        <p className="text-primary-700 font-bold font-inter">
                            {calculateSubtotal().toFixed(2)} BAHT
                        </p>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-primary-700 font-inter font-bold">SHIPPING FEE</p>
                        {loadingAddress ? (
                            <p className="text-primary-700 font-bold font-inter">Calculating...</p>
                        ) : (
                            <p className="text-primary-700 font-bold font-inter">
                                {shippingFee === 0 ? 'FREE' : `${shippingFee.toFixed(2)} BAHT`}
                            </p>
                        )}
                    </div>

                    <hr className="my-2 border-t border-neutral-gray-200" />

                    <div className="flex justify-between items-center mb-6">
                        <p className="text-primary-700 font-inter font-bold">TOTAL</p>
                        <p className="text-primary-700 font-bold font-inter">
                            {calculateTotal().toFixed(2)} BAHT
                        </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-gray-200 space-y-3">
                        <button
                            className={`w-full primary-buttons ${(isCartEmpty || loadingAddress) && 'disabled'}`}
                            onClick={handleConfirm}
                            disabled={isCartEmpty || loading || loadingAddress}
                        >
                            {loadingAddress ? 'CALCULATING SHIPPING...' : 'CONFIRM'}
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