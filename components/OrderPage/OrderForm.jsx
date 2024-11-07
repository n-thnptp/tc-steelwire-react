import React from 'react';
import useOrderContext from '../../components/Hooks/useOrderContext';
import useLoginContext from '../../components/Hooks/useLoginContext';
import ProductSelection from './ProductSelection';
import SummaryView from './SummaryView';

const OrderForm = () => {
    const { error } = useOrderContext();
    const { user, loading } = useLoginContext();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="h-[calc(100dvh-4rem)] bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // If no user, don't render anything
    if (!user) {
        return null;
    }

    // Add this function to your component
    const handleNumberOnly = (e) => {
        // Prevent non-numeric input
        if (!/^\d*$/.test(e.target.value)) {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
        }
    };

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

