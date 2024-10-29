import React from 'react';
import useOrderContext from '../Hooks/useOrderContext';
import { IconButton } from "@material-tailwind/react";
import { calculateMinimumWeight, WEIGHT_PER_METER } from '../Utils/weightCalculations';
import { IoCloseCircle } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";

const ProductSelection = () => {
    const { orderState, addItem, updateItem, removeItem } = useOrderContext();

    const handleNumberInput = (e, index, field) => {
        const value = e.target.value;

        if (value < 0) {
            return; // Prevent negative values
        }

        if (field === 'weight') {
            const newWeight = parseFloat(value) || 0;
            const otherItemsWeight = orderState.items.reduce((acc, item, idx) =>
                idx !== index ? acc + (parseFloat(item.weight) || 0) : acc, 0);
            const totalWeight = newWeight + otherItemsWeight;

            if (totalWeight > 3800) {
                alert("น้ำหนักรวมต้องไม่เกิน 3.8 ตัน (3800 KG)");
                return;
            }

            // Check minimum weight based on length and size
            const currentItem = orderState.items[index];
            const minWeight = calculateMinimumWeight(currentItem.length, currentItem.steelSize);
            if (newWeight < minWeight) {
                alert(`น้ำหนักต้องไม่น้อยกว่า ${minWeight} KG สำหรับขนาด ${currentItem.steelSize}mm และความยาว ${(parseFloat(currentItem.length) / 100).toFixed(2)}m`);
                return;
            }
        }

        updateItem(index, field, value);
    };

    const handleLengthInput = (e, index) => {
        const value = e.target.value;
        if (value < 0) return;

        updateItem(index, 'length', value);

        // If there's already a weight, validate it against the new length
        const currentItem = orderState.items[index];
        if (currentItem.weight && currentItem.steelSize) {
            const minWeight = calculateMinimumWeight(value, currentItem.steelSize);
            if (parseFloat(currentItem.weight) < minWeight) {
                alert(`น้ำหนักต้องปรับให้ไม่น้อยกว่า ${minWeight} KG สำหรับความยาวนี้`);
            }
        }
    };

    return (
        <div className="bg-white shadow-md p-6 rounded-lg w-4/6 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pb-4 min-h-0">
                {orderState.items.map((item, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-lg relative">
                        <div className="absolute top-2 right-2 p-2 cursor-pointer">
                            <IconButton
                                variant="text"
                                className={`rounded-full hover:bg-primary-50`}
                                onClick={() => removeItem(index)}
                            >
                                <IoCloseCircleOutline className="text-3xl text-primary-700" />
                            </IconButton>
                        </div>


                        <div className="mb-2">
                            <select
                                className="w-1/5 p-2 border rounded text-primary-700 shadow"
                                value={item.product}
                                onChange={(e) => updateItem(index, 'product', e.target.value)}
                            >
                                <option value="PC WIRE">PC WIRE</option>
                                <option value="PC STRAND">PC STRAND</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            <select
                                className="p-2 border rounded text-primary-700 shadow"
                                value={item.steelSize}
                                onChange={(e) => updateItem(index, 'steelSize', e.target.value)}
                            >
                                <option value="" disabled>SIZE</option>
                                {Object.entries(WEIGHT_PER_METER).map(([size, weight]) => (
                                    <option key={size} value={size}>{size} MM</option>
                                ))}
                            </select>
                            <select
                                className="p-2 border rounded text-primary-700 shadow"
                                value={item.steelFeature}
                                onChange={(e) => updateItem(index, 'steelFeature', e.target.value)}
                            >
                                <option value="" disabled>FEATURE</option>
                                <option value="Indented">Indented</option>
                                <option value="Plain">Plain</option>
                            </select>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="p-2 border rounded text-primary-700 shadow"
                                placeholder="LENGTH (CM)"
                                value={item.length}
                                onChange={(e) => handleLengthInput(e, index)}
                            />
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="p-2 border rounded text-primary-700 shadow"
                                placeholder="WEIGHT (KG)"
                                value={item.weight}
                                onChange={(e) => handleNumberInput(e, index, 'weight')}
                            />
                        </div>
                        {item.steelSize && (
                            <div className="mt-2 text-sm text-primary-500">
                                Minimum weight per meter: {WEIGHT_PER_METER[item.steelSize]} kg/m
                            </div>
                        )}
                        {item.steelSize && item.length && (
                            <div className="mt-1 text-sm text-primary-500">
                                Minimum total weight for this length: {calculateMinimumWeight(item.length, item.steelSize)} kg
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="pt-4 border-t mt-auto"> {/* Added mt-auto */}
                <button
                    onClick={addItem}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default ProductSelection;