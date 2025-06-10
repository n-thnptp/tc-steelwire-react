import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Banking from './Banking';
import SummaryCheckout from './SummaryCheckout';

const PaymentPage = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPromptPayOpen, setIsPromptPayOpen] = useState(true);
    const [loading, setLoading] = useState(false);

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

    const handleCheckout = async () => {
        if (isPromptPayOpen && !selectedFile) {
            alert('Please upload your payment slip first');
            return;
        }

        setLoading(true);
        try {
            if (isPromptPayOpen && selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('orderId', orderId);
                formData.append('amount', totalAmount);

                const response = await fetch('/api/payment/upload-slip', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to process payment');
                }

                const data = await response.json();

                
                if (data.success) {
                    router.push('/status');
                }
            } else {
                router.push('/status');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Failed to process payment. Please try again.');
        } finally {
            setLoading(false);
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
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            isPromptPayOpen={isPromptPayOpen}
                            setIsPromptPayOpen={setIsPromptPayOpen}
                        />
                    </div>
                    <div className="w-full lg:w-2/5 rounded-lg p-4">
                        <SummaryCheckout 
                            orderId={orderId} 
                            selectedFile={selectedFile}
                            isPromptPayOpen={isPromptPayOpen}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
