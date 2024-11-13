import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Banking from './Banking';
import SummaryCheckout from './SummaryCheckout';

const PaymentPage = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/order/${orderId}`);
            const data = await response.json();
            if (data.success) {
                setOrderDetails(data.order);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row p-8 justify-between items-start">
                    <div className="w-full lg:w-3/5 rounded-lg p-4 overflow-y-auto mb-4 lg:mb-0">
                        <Banking 
                            orderId={orderId} 
                            totalAmount={orderDetails?.o_total_price} 
                        />
                    </div>
                    <div className="w-full lg:w-2/5 rounded-lg p-4">
                        <SummaryCheckout orderId={orderId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
