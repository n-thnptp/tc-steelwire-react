import React, { useState } from 'react';
import useOrderContext from '../Hooks/useOrderContext';
import { calculateMinimumWeight, getMinWeightPerMeters } from '../Utils/weightCalculations';

const SummaryView = () => {
    const { orderState, handleConfirm, loading } = useOrderContext();
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    // Add calculateTotalPrice function
    const calculateTotalPrice = () => {
        if (!orderState.items) return 0;

        return orderState.items.reduce((total, item) => {
            // Skip if item doesn't have weight or size
            if (!item.weight || !item.ms_id) return total;

            // Get price per kg for this size
            const specs = getMinWeightPerMeters(item.ms_id);
            if (!specs) return total;

            // Calculate price: weight * price per kg
            return total + item.price;
        }, 0);
    };

    if (!orderState) {
        return <div>Loading...</div>;
    }

    const isFormValid = () => {
        if (!orderState.items || orderState.items.length === 0) {
            return false;
        }

        return orderState.items.every(item =>
            item.mt_id &&
            item.ms_id &&
            item.feature &&
            item.length &&
            item.weight
        );
    };

    // Function to show error with timeout
    const showTemporaryError = (message) => {
        setError(message);
        setShowError(true);
        
        // Clear error after 3 seconds
        setTimeout(() => {
            setShowError(false);
            // Optional: clear the error message after fade out
            setTimeout(() => setError(''), 300); // 300ms matches the fade duration
        }, 3000);
    };

    const checkStock = async (items) => {
        try {
            // Format the items properly
            const formattedItems = items.map(item => ({
                mt_id: parseInt(item.mt_id),
                ms_id: parseInt(item.ms_id),
                weight: parseFloat(item.weight)
            }));


            const response = await fetch('/api/stock/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: formattedItems
                })
            });

            const data = await response.json();
            
            // Handle both 200 and 400 responses here
            if (!data.success) {
                showTemporaryError(data.message);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Stock check error:', error);
            showTemporaryError('Failed to check stock availability');
            return false;
        }
    };

    const handleAddToCart = async () => {
        // Clear any existing error
        setShowError(false);
        setError('');

        // First check length and weight requirements
        for (let i = 0; i < orderState.items.length; i++) {
            const item = orderState.items[i];
            const length = parseFloat(item.length);
            const weight = parseFloat(item.weight);
            const minWeight = calculateMinimumWeight(item.length, item.ms_id);

            if (length < 100) {
                showTemporaryError(`Item ${i + 1}: ความยาวต้องไม่น้อยกว่า 100 cm`);
                return;
            }

            if (weight < parseFloat(minWeight)) {
                showTemporaryError(`Item ${i + 1}: น้ำหนักต้องไม่น้อยกว่า ${minWeight} KG สำหรับขนาด ${item.ms_id}mm และความยาว ${(length / 100).toFixed(2)}m`);
                return;
            }
        }

        // Then check stock availability
        const hasStock = await checkStock(orderState.items);
        if (!hasStock) {
            return; // Error message is already set by checkStock
        }

        // If all checks pass, proceed with order
        handleConfirm();
    };

    return (
        <div className="bg-neutral-white shadow-md p-6 rounded-lg w-2/6 flex flex-col h-full">
            <div className="mb-4">
                <h2 className="text-4xl font-bold text-primary-700 text-right font-inter">Summary</h2>
            </div>

            <div className="flex-1 overflow-y-auto pb-4 min-h-0 h-fit">
                <div className="bg-gray-100 rounded-lg shadow-lg p-4">
                    <p className={`mb-2 font-inter ${orderState.currentWeight > 3800 ? 'text-status-error font-bold' : 'text-gray-500'}`}>
                        CURRENT WEIGHT: {orderState.currentWeight.toFixed(2)} KG / 3800 KG
                    </p>

                    {/* Items List */}
                    <div className="space-y-4 mb-4 font-inter">
                        {orderState.items.map((item, index) => {
                            // Find the material type name
                            const materialType = orderState.materials.find(m => m.id === item.mt_id)?.name;
                            // Find the size details
                            const size = orderState.sizes.find(s => s.id === item.ms_id)?.size;

                            return (
                                <div key={index} className="border-b border-gray-200 pb-3">
                                    <p className="text-lg text-primary-700 font-semibold">
                                        Item {index + 1}: PC {materialType || '-'}
                                    </p>
                                    <div className="grid grid-flow-row gap-1 text-base text-primary-700">
                                        <p>Size: <span className="text-primary-600">{size ? `${size} MM` : '-'}</span></p>
                                        <p>Feature: <span className="text-primary-600">{item.feature || '-'}</span></p>
                                        <p>Length: <span className="text-primary-600">{item.length ? `${item.length} CM` : '-'}</span></p>
                                        <p>Weight: <span className="text-primary-600">{item.weight ? `${item.weight} KG` : '-'}</span></p>
                                        <p className="font-bold text-lg">Price: <span className="text-primary-700">{item.price ? `฿ ${item.price}` : '-'}</span></p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mb-4 font-inter text-gray-500">
                        TOTAL PRICE: ฿{calculateTotalPrice().toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Error message with fade animation */}
            <div
                className={`transition-all duration-300 ease-in-out ${
                    showError 
                        ? 'opacity-100 max-h-20' 
                        : 'opacity-0 max-h-0'
                }`}
            >
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
            </div>

            <div className="pt-4 border-t mt-auto">
                <button
                    onClick={handleAddToCart}
                    disabled={!isFormValid() || loading}
                    className={`primary-buttons w-full transition-colors
                        ${isFormValid() ? 'primary-buttons' : 'disabled'}`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'ADD TO CART'
                    )}
                </button>
            </div>
        </div>
    );
};

export default SummaryView;
