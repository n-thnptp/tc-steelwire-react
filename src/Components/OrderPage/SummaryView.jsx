import React from 'react';
import useOrderContext from '../Hooks/useOrderContext';
import { calculateMinimumWeight } from '../Utils/weightCalculations';

const SummaryView = () => {
    const { orderState, handleConfirm, loading } = useOrderContext();

    const isFormValid = () => {
        return orderState.items.every(item => {
            const length = parseFloat(item.length);
            const weight = parseFloat(item.weight);
            const minWeight = calculateMinimumWeight(item.length, item.steelSize);

            return (
                item.steelSize &&
                item.steelFeature &&
                typeof length === 'number' &&
                !isNaN(length) &&
                length > 0 &&
                typeof weight === 'number' &&
                !isNaN(weight) &&
                weight >= minWeight &&
                orderState.currentWeight <= 3800
            );
        });
    };

    // Convert cm to meters with 2 decimal places
    const formatLength = (lengthInCm) => {
        if (!lengthInCm) return '';
        const meters = parseFloat(lengthInCm) / 100;
        return meters.toFixed(2);
    };

    const handleSubmit = () => {
        console.log('Submitting order with details:', {
            totalWeight: orderState.currentWeight,
            numberOfItems: orderState.items.length,
            items: orderState.items.map(item => ({
                product: item.product,
                steelSize: `${item.steelSize} MM`,
                steelFeature: item.steelFeature,
                length: `${formatLength(item.length)} M`,
                weight: `${item.weight} KG`,
                minWeightRequired: `${calculateMinimumWeight(item.length, item.steelSize)} KG`
            }))
        });

        handleConfirm();
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
                        {orderState.currentWeight > 3800 && (
                            <span className="block text-sm mt-1">
                                Weight exceeds maximum limit of 3800 KG
                            </span>
                        )}
                    </p>
                    
                    {orderState.items.map((item, index) => {
                        const minWeight = calculateMinimumWeight(item.length, item.steelSize);
                        return (
                            <div key={index} className="text-accent-900 font-inter font-bold mb-4 last:mb-0">
                                <div className="bg-white rounded-lg p-3 shadow">
                                    <p className="text-primary-700"><span className="text-gray-600">TYPE: </span> {item.product}</p>
                                    <p className="text-primary-700"><span className="text-gray-600">STEEL SIZE: </span> {item.steelSize} MM</p>
                                    <p className="text-primary-700"><span className="text-gray-600">STEEL FEATURE: </span> {item.steelFeature}</p>
                                    <p className="text-primary-700"><span className="text-gray-600">LENGTH: </span> {formatLength(item.length)} M</p>
                                    <p className="text-primary-700"><span className="text-gray-600">WEIGHT: </span> {item.weight} KG</p>
                                    
                                    {/* Validation Messages */}
                                    <div className="mt-2 text-status-error text-sm">
                                        {!item.steelSize && (
                                            <p>• Steel size is required</p>
                                        )}
                                        {!item.steelFeature && (
                                            <p>• Steel feature is required</p>
                                        )}
                                        {(!item.length || parseFloat(item.length) <= 0) && (
                                            <p>• Valid length is required</p>
                                        )}
                                        {(!item.weight || parseFloat(item.weight) < minWeight) && (
                                            <p>
                                                • Minimum weight required: {minWeight} KG
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
    
            <div className="pt-4 border-t mt-auto"> {/* Added mt-auto */}
                <button 
                    onClick={handleSubmit}
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