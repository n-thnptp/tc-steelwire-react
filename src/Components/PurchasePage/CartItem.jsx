import React from 'react';
import useCart from '../Hooks/useCartContext';
import { FaTrash } from "react-icons/fa6";

const CartItem = ({ item, orderIndex, itemIndex }) => {
    const { removeItem } = useCart();

    const handleRemove = () => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            removeItem(orderIndex, itemIndex);
        }
    };

    return (
        <div className="bg-white rounded-lg mb-4 p-4">
            <div className="flex space-x-4">
                {/* Product Image */}
                <div className="w-1/4">
                    <img
                        src={item.image || "/pic/PC-strand1.png"}
                        alt={item.product || item.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-primary-700 font-bold font-inter text-lg">{item.product || item.name}</h3>
                        </div>
                        <div>
                            <p className="text-primary-700 font-bold font-inter text-lg">{item.price || "XX,XXX.XX BAHT"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-primary-500 font-inter">
                            <p className="mb-1">SIZE: <span className="text-primary-700">{item.steelSize || "XX.XX"} MM</span></p>
                            <p className="mb-1">WEIGHT: <span className="text-primary-700">{item.weight || "X,XXX.XX"} KG</span></p>
                            <p className="mb-1">LENGTH: <span className="text-primary-700">{item.length || "XX.XX"} M</span></p>
                            <p className="mb-1">FEATURE: <span className="text-primary-700">{item.steelFeature || "SMOOTH / INDENTATIONS"}</span></p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                        <button
                            onClick={handleRemove}
                            className="text-primary-500 hover:text-status-error transition-colors"
                        >
                            <FaTrash size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;