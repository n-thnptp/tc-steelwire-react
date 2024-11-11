import React from 'react';
import useOrderContext from '../Hooks/useOrderContext';
import { calculateMinimumWeight } from '../Utils/weightCalculations';

const SummaryView = () => {
    const { orderState, handleConfirm, loading } = useOrderContext();

    if (!orderState) {
        return <div>Loading...</div>;
    }

    const isFormValid = () => {
        // First check if we have items to validate
        if (!orderState.items || orderState.items.length === 0) {
            return false;
        }

        return orderState.items.every(item => {
            // Parse values once
            const length = parseFloat(item.length);
            const weight = parseFloat(item.weight);
            const minWeight = calculateMinimumWeight(item.length, item.steelSize);
            const size = orderState.sizes.find(s => s.size.toString() === item.steelSize);

            // Debug log to see what's failing
            console.log('Validation check:', {
                hasSize: !!item.steelSize,
                hasFeature: !!item.steelFeature,
                validLength: typeof length === 'number' && !isNaN(length) && length > 0,
                validWeight: typeof weight === 'number' && !isNaN(weight) && weight >= minWeight,
                withinMaxWeight: (orderState.currentWeight ?? 0) <= 3800,
                hasValidSize: !!size
            });

            return (
                item.steelSize &&
                item.steelFeature &&
                typeof length === 'number' &&
                !isNaN(length) &&
                length > 0 &&
                typeof weight === 'number' &&
                !isNaN(weight) &&
                weight >= minWeight &&
                (orderState.currentWeight ?? 0) <= 3800 &&
                size
            );
        });
    };

    // Calculate total price
    const calculateTotalPrice = () => {
        return orderState.items.reduce((total, item) => {
            const size = orderState.sizes.find(s => s.size.toString() === item.steelSize);
            return total + (parseFloat(item.weight) * (size?.price || 0));
        }, 0);
    };

    return (
        <div className="bg-neutral-white shadow-md p-6 rounded-lg w-2/6 flex flex-col h-full">
            <div className="mb-4">
                <h2 className="text-4xl font-bold text-primary-700 text-right font-inter">Summary</h2>
            </div>

            <div className="flex-1 overflow-y-auto pb-4 min-h-0">
                <div className="bg-gray-100 rounded-lg shadow-lg p-4">
                    <p className={`mb-2 font-inter ${orderState.currentWeight > 3800 ? 'text-status-error font-bold' : 'text-gray-500'}`}>
                        CURRENT WEIGHT: {orderState.currentWeight.toFixed(2)} KG / 3800 KG
                    </p>
                    <p className="mb-4 font-inter text-gray-500">
                        TOTAL PRICE: ฿{calculateTotalPrice().toFixed(2)}
                    </p>

                    {/* Rest of your summary view code... */}
                </div>
            </div>

            <div className="pt-4 border-t mt-auto">
                <button
                    onClick={handleConfirm}
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
