import React, { useState, useEffect } from 'react';

const CourierModal = ({ isOpen, onClose, onConfirm, selectedOrders }) => {
    const [couriers, setCouriers] = useState([]);
    const [selectedCourier, setSelectedCourier] = useState('');

    useEffect(() => {
        const fetchCouriers = async () => {
            try {
                const response = await fetch('/api/manager/couriers');
                const data = await response.json();
                setCouriers(data.couriers);
            } catch (error) {
                console.error('Error fetching couriers:', error);
            }
        };

        if (isOpen) {
            fetchCouriers();
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (!selectedCourier) return;
        onConfirm(selectedCourier);
        setSelectedCourier('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold text-primary-800 mb-4 font-inter">Select Courier</h2>
                
                <div className="mb-4">
                    <select
                        value={selectedCourier}
                        onChange={(e) => setSelectedCourier(e.target.value)}
                        className="w-full p-2 border border-primary-500 rounded-lg"
                    >
                        <option value="">Select a courier</option>
                        {couriers.map((courier) => (
                            <option key={courier.courier_id} value={courier.courier_id}>
                                {courier.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedCourier}
                        className={`px-4 py-2 rounded-lg text-white
                            ${selectedCourier ? 'bg-primary-500 hover:bg-primary-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourierModal; 