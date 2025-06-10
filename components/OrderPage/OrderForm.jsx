import React, { useEffect, useState } from 'react';
import useOrderContext from '../../components/Hooks/useOrderContext';
import useLoginContext from '../../components/Hooks/useLoginContext';
import ProductSelection from './ProductSelection';
import SummaryView from './SummaryView';

const OrderForm = () => {
    const { error } = useOrderContext();
    const { user, loading } = useLoginContext();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Check both context and localStorage
        const storedUser = localStorage.getItem('user');
        const effectiveUser = user || (storedUser ? JSON.parse(storedUser) : null);
        
        if (effectiveUser) {
            setIsInitialized(true);
        }
    }, [user]);

    // Show loading state while checking authentication
    if (loading || !isInitialized) {
        return (
            <div className="h-[calc(100dvh-4rem)] bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Check both context and localStorage
    const effectiveUser = user || JSON.parse(localStorage.getItem('user') || 'null');

    // If no user, don't render anything
    if (!effectiveUser) {
        return null;
    }

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

