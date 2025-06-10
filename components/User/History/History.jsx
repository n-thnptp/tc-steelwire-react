import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { formatDate } from '../../Utils/formatDate';
import { formatNumber } from '../../Utils/formatNumber';
import { getOrderStatus } from '../../Utils/getOrderStatus';

const History = () => {
    const [orders, setOrders] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/user/order-history');
                const data = await response.json();
                setOrders(data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const handleRowClick = (orderId) => {
        router.push(`/history/${orderId}`);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-primary-800 mb-6">ORDER HISTORY</h2>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left">ORDER ID</th>
                                <th className="py-3 px-4 text-left">ORDER DATE</th>
                                <th className="py-3 px-4 text-left">TOTAL PRICE</th>
                                <th className="py-3 px-4 text-left">STATUS</th>
                                <th className="py-3 px-4 text-left">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr 
                                    key={order.o_id}
                                    onClick={() => handleRowClick(order.o_id)}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="py-3 px-4">{order.o_id}</td>
                                    <td className="py-3 px-4">{formatDate(order.o_date)}</td>
                                    <td className="py-3 px-4">{formatNumber(order.o_total_price)}</td>
                                    <td className="py-3 px-4">{getOrderStatus(order.status)}</td>
                                    <td className="py-3 px-4">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row click when clicking button
                                                // Handle reorder logic here
                                            }}
                                            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                                        >
                                            REORDER
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History; 