import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { IoReturnUpBack } from "react-icons/io5";

const HistoryOrderDetail = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) return;
            try {
                const response = await fetch(`/api/user/order-history/${orderId}`);
                const data = await response.json();
                if (data.success) {
                    setOrderDetails(data.order);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    return (
        <div className="flex flex-col lg:flex-row p-8 h-[calc(100dvh-4rem)] justify-center bg-white items-start">
            <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg overflow-hidden h-[95%] flex flex-col">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#595871] font-inter">
                        ORDER : {orderId}
                    </h2>
                </div>

                <div className="bg-gray-100 grid grid-cols-6 py-2 px-4 rounded-t-lg font-semibold">
                    <div className="text-[#4C4C60]">PRODUCT ID</div>
                    <div className="text-[#4C4C60]">PC TYPE</div>
                    <div className="text-[#4C4C60]">SIZE</div>
                    <div className="text-[#4C4C60]">FEATURE</div>
                    <div className="text-[#4C4C60]">LENGTH</div>
                    <div className="text-[#4C4C60]">WEIGHT</div>
                </div>

                <div className="overflow-y-auto flex-grow mb-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {orderDetails?.products?.map((product, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="grid grid-cols-6 py-4 px-4 border-b items-center hover:bg-gray-50"
                                >
                                    <div>{product.product_id}</div>
                                    <div>PC {product.material_name}</div>
                                    <div>{product.size} MM</div>
                                    <div>{product.feature}</div>
                                    <div>{product.length} M</div>
                                    <div>{product.quantity} KG</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>

                <div className="flex justify-end mt-auto pt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.back()}
                        className="bg-[#6B7280] text-white px-8 py-3 rounded-full hover:bg-[#4B5563] transition-colors flex items-center gap-2 text-lg font-medium"
                    >
                        <IoReturnUpBack className="text-2xl" />
                        Back
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default HistoryOrderDetail; 