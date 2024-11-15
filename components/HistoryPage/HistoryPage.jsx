import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showOrderByOptions, setShowOrderByOptions] = useState(false);
    const [sortColumn, setSortColumn] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const ordersPerPage = 8;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/orders/history?page=${currentPage}&limit=${ordersPerPage}`);
                const data = await response.json();
                
                if (data.success) {
                    setOrders(data.result);
                    setTotalPages(Math.ceil(data.total / ordersPerPage));
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [currentPage]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
        setShowOrderByOptions(false);
    };

    // Sort orders based on current sort settings
    const sortedOrders = [...orders].sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        
        switch (sortColumn) {
            case 'orderId':
                return (a.o_id - b.o_id) * multiplier;
            case 'price':
                return (a.o_total_price - b.o_total_price) * multiplier;
            case 'date':
                return (new Date(a.o_date) - new Date(b.o_date)) * multiplier;
            default:
                return 0;
        }
    });

    const handleReOrder = async (orderId) => {
        try {
            const response = await fetch('/api/orders/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId }),
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to purchase page instead of cart
                window.location.href = '/purchase';
            } else {
                alert(data.message || 'Failed to re-order. Please try again.');
            }
        } catch (error) {
            console.error('Error re-ordering:', error);
            alert('Error occurred while re-ordering. Please try again.');
        }
    };

    // Add pagination handler
    const handlePageChange = (newPage) => {
        // Don't do anything if clicking the current page
        if (newPage === currentPage) return;
        
        setCurrentPage(newPage);
        setIsLoading(true);
    };

    const handleOrderClick = (orderId) => {
        router.push(`/history/${orderId}`);
    };

    return (
        <div className="flex flex-col lg:flex-row p-8 h-[calc(100dvh-4rem)] justify-center bg-white items-start">
            <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg overflow-hidden h-[95%] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#603F26] font-inter">ORDER HISTORY</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button 
                                className="bg-[#6B7280] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                onClick={() => setShowOrderByOptions(!showOrderByOptions)}
                            >
                                <span className="text-xs">▲▼</span>
                                Order By
                            </button>
                            
                            {showOrderByOptions && (
                                <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border">
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                                        onClick={() => handleSort('orderId')}
                                    >
                                        Order ID
                                        {sortColumn === 'orderId' && (
                                            <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                        )}
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                                        onClick={() => handleSort('price')}
                                    >
                                        Price
                                        {sortColumn === 'price' && (
                                            <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                        )}
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                                        onClick={() => handleSort('date')}
                                    >
                                        Date
                                        {sortColumn === 'date' && (
                                            <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Search Product"
                            className="px-4 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                <div className="bg-gray-100 grid grid-cols-5 py-2 px-4 rounded-t-lg font-semibold">
                    <div className="text-[#4C4C60]">ORDER ID</div>
                    <div className="text-[#4C4C60]">DATE</div>
                    <div className="text-[#4C4C60]">PRICE</div>
                    <div className="text-[#4C4C60]">PROGRESS</div>
                    <div className="text-[#4C4C60] text-center">ACTION</div>
                </div>

                <div className="overflow-y-auto flex-grow mb-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {sortedOrders.map((order, index) => (
                                    <motion.div
                                        key={order.o_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleOrderClick(order.o_id)}
                                        className="grid grid-cols-5 py-4 px-4 border-b items-center hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div>{order.o_id}</div>
                                        <div>{new Date(order.o_date).toLocaleDateString()}</div>
                                        <div>{order.o_total_price.toLocaleString()} BAHT</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div 
                                                    className="bg-green-500 h-2.5 rounded-full" 
                                                    style={{ width: `${order.o_status_id === 4 ? '100' : '0'}%` }}
                                                ></div>
                                            </div>
                                            <span>{order.o_status_id === 4 ? '100%' : '0%'}</span>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row click when clicking reorder
                                                    handleReOrder(order.o_id);
                                                }}
                                                className="text-green-500 hover:text-green-600 flex items-center gap-1 font-medium"
                                            >
                                                <span>🔄</span>
                                                RE-ORDER
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                <div className="flex justify-center items-center gap-2 py-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
                    >
                        Previous
                    </motion.button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <motion.button
                            key={index + 1}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                currentPage === index + 1 
                                    ? 'bg-[#6B7280] text-white scale-110' 
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {index + 1}
                        </motion.button>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
                    >
                        Next
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
