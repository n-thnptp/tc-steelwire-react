import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function OrderDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/orders/${id}`);
            const data = await response.json();
            if (data.success) {
                setOrderDetails(data.order);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptDelivery = async () => {
        try {
            const response = await fetch('/api/order/accept_delivery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: id }),
            });

            if (response.ok) {
                fetchOrderDetails();
            }
        } catch (error) {
            console.error('Error accepting delivery:', error);
        }
    };

    if (loading || !orderDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-semibold mb-2">ORDER DETAILS</h1>
                    <p className="text-gray-500 mb-8">DATE : {new Date(orderDetails.o_date).toLocaleDateString()}</p>

                    {/* Progress Bar */}
                    <div className="relative mb-16">
                        {/* Progress Bar Line */}
                        <div className="h-0.5 bg-gray-200 w-full relative max-w-2xl mx-auto">
                            <div 
                                className="h-0.5 bg-[#6B7280]" 
                                style={{ 
                                    width: orderDetails.o_status_id >= 4 ? '100%' : 
                                           orderDetails.o_status_id >= 2 ? '50%' : '25%' 
                                }}
                            />
                            
                            {/* Checkpoints with Text Below */}
                            <div className="flex justify-between absolute w-full top-1/2 -translate-y-1/2">
                                <div className="text-center -ml-3">
                                    <div className={`w-6 h-6 rounded-full ${orderDetails.o_status_id >= 1 ? 'bg-[#6B7280]' : 'bg-gray-200'} flex items-center justify-center`}>
                                        {orderDetails.o_status_id >= 1 && (
                                            <span className="text-white text-sm">✓</span>
                                        )}
                                    </div>
                                    <div className="mt-4 w-32">
                                        <p className="text-sm font-bold text-[#6B7280]">ORDER CONFIRMED</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(orderDetails.o_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                <div className="text-center -translate-x-3">
                                    <div className={`w-6 h-6 rounded-full ${orderDetails.o_status_id >= 2 ? 'bg-[#6B7280]' : 'bg-gray-200'} flex items-center justify-center`}>
                                        {orderDetails.o_status_id >= 2 && (
                                            <span className="text-white text-sm">📦</span>
                                        )}
                                    </div>
                                    <div className="mt-4 w-24">
                                        <p className="text-sm font-bold text-[#6B7280]">SHIPPING</p>
                                    </div>
                                </div>
                                
                                <div className="text-center -mr-3">
                                    <div className={`w-6 h-6 rounded-full ${orderDetails.o_status_id >= 4 ? 'bg-[#6B7280]' : 'bg-gray-200'} flex items-center justify-center`} />
                                    <div className="mt-4 w-32">
                                        <p className="text-sm font-bold text-[#6B7280]">DELIVER SUCCESS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Courier Information */}
                    <div className="mb-12">
                        <label className="block text-sm text-gray-500 mb-2">
                            COURIER NAME
                        </label>
                        <input
                            type="text"
                            value={orderDetails.courier_name || 'Not assigned'}
                            disabled
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between">
                        <button 
                            onClick={() => router.back()}
                            className="px-12 py-3 border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                            BACK
                        </button>
                        
                        {orderDetails.o_status_id !== 4 && orderDetails.o_status_id !== 5 && (
                            <button 
                                onClick={handleAcceptDelivery}
                                className="px-12 py-3 bg-green-500 text-white rounded-full hover:bg-green-600"
                            >
                                ACCEPT DELIVERY
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 