import React from 'react';
import { useRouter } from 'next/router';
import useCart from '../Hooks/useCartContext';

const PurchaseSummary = () => {
    const router = useRouter();
    const { orders, loading } = useCart();
    const subtotal = 'XXX.XX BAHT';
    const total = 'XX,XX7.XX BAHT';

    const isCartEmpty = !orders || orders.length === 0;

    return (
        <div className="bg-neutral-white p-6 rounded-lg">
            <div className="bg-neutral-white rounded-lg">
                <h2 className="text-2xl font-bold text-primary-700 font-inter mb-6">SUMMARY</h2>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-primary-700 font-inter">SUBTOTAL</p>
                        <p className="text-primary-700 font-bold font-inter">{subtotal}</p>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <p className="text-primary-700 font-inter">TOTAL</p>
                        <p className="text-primary-700 font-bold font-inter">{total}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-gray-200 space-y-3">
                        <button
                            className={`w-full primary-buttons ${isCartEmpty && 'disabled'}`}
                            onClick={() => router.push('/payment')}
                            disabled={isCartEmpty || loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'CONFIRM'
                            )}
                        </button>
                        <button
                            className="w-full secondary-buttons"
                            onClick={() => router.back()}
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseSummary;