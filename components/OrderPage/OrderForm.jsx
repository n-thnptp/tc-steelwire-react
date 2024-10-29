import React from 'react';
import useOrderContext from '../Hooks/useOrderContext';
import ProductSelection from './ProductSelection'
import SummaryView from './SummaryView';

const OrderForm = () => {
    const { error } = useOrderContext();

    return (
        <div className="h-[calc(100dvh-4rem)] bg-gray-50 overflow-hidden">
            <main className="h-full max-w-7xl mx-auto px-4 py-6">
                {error && (
                    <div className="mb-4 text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-6 h-[calc(100%-2rem)]">
                    <ProductSelection />
                    <SummaryView />
                </div>
            </main>
        </div>
    );
};

export default OrderForm;