import React from 'react';
import CartView from './CartView';
import PurchaseSummary from './PurchaseSummary';

const PurchasePage = () => {
    return (
        <div className="h-[calc(100dvh-4rem)] bg-gray-50 overflow-hidden">
            <div className="h-full max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8 h-[calc(100%-2rem)]">
                    {/* Cart Items Section */}
                    <div className="flex-grow lg:w-2/3 overflow-hidden">
                        <CartView />
                    </div>

                    {/* Summary Section */}
                    <div className="lg:w-1/3">
                        <div className="lg:sticky lg:top-8">
                            <PurchaseSummary />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchasePage;