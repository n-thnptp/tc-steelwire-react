import React, { useEffect, useState } from 'react';
import useOrderContext from '../Hooks/useOrderContext';
import { IconButton } from "@material-tailwind/react";
import { calculateMinimumWeight } from '../Utils/weightCalculations';
import { IoCloseCircleOutline } from "react-icons/io5";

const ProductSelection = () => {
    const { orderState, addItem, updateItem, removeItem } = useOrderContext();
    const [materials, setMaterials] = useState({
        materialTypes: [],
        sizes: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await fetch('/api/order/materials');
                if (!response.ok) {
                    throw new Error('Failed to fetch materials');
                }
                const data = await response.json();
                setMaterials(data);
            } catch (error) {
                console.error('Error fetching materials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    const handleNumberInput = (e, index, field) => {
        const value = e.target.value;
        updateItem(index, field, value);

        if (field === 'weight' && value) {
            const newWeight = parseFloat(value) || 0;
            const otherItemsWeight = orderState.items.reduce((acc, item, idx) =>
                idx !== index ? acc + (parseFloat(item.weight) || 0) : acc, 0);
            const totalWeight = newWeight + otherItemsWeight;

            if (totalWeight > 3800) {
                alert("น้ำหนักรวมต้องไม่เกิน 3.8 ตัน (3800 KG)");
                return;
            }

            const currentItem = orderState.items[index];
            if (currentItem.length && currentItem.steelSize) {
                const minWeight = calculateMinimumWeight(currentItem.length, currentItem.steelSize);
                if (newWeight < minWeight) {
                    alert(`น้ำหนักต้องไม่น้อยกว่า ${minWeight} KG สำหรับขนาด ${currentItem.steelSize}mm และความยาว ${(parseFloat(currentItem.length) / 100).toFixed(2)}m`);
                }
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-neutral-white shadow-md p-6 rounded-lg w-4/6 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pb-4 min-h-0">
                {orderState.items.map((item, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-lg relative">
                        <div className="absolute top-2 right-2">
                            <IconButton
                                variant="text"
                                className="rounded-full hover:bg-primary-50"
                                onClick={() => removeItem(index)}
                            >
                                <IoCloseCircleOutline className="text-3xl text-primary-700" />
                            </IconButton>
                        </div>

                        <div className="mb-2">
                            <select
                                className="w-1/5 p-2 border rounded text-primary-700 shadow"
                                value={item.product || "PC WIRE"}
                                onChange={(e) => updateItem(index, 'product', e.target.value)}
                            >
                                {materials.materialTypes.map(type => (
                                    <option key={type.id} value={type.name}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            <select
                                className="p-2 border rounded text-primary-700 shadow"
                                value={item.steelSize || ""}
                                onChange={(e) => updateItem(index, 'steelSize', e.target.value)}
                            >
                                <option value="" disabled>SIZE</option>
                                {materials.sizes.map(size => (
                                    <option key={size.id} value={size.size}>
                                        {size.size} MM
                                    </option>
                                ))}
                            </select>
                            <select
                                className="p-2 border rounded text-primary-700 shadow"
                                value={item.steelFeature || ""}
                                onChange={(e) => updateItem(index, 'steelFeature', e.target.value)}
                            >
                                <option value="" disabled>FEATURE</option>
                                <option value="Indented">Indented</option>
                                <option value="Plain">Plain</option>
                            </select>
                            <input
                                type="text"
                                className="p-2 border rounded text-primary-700 shadow"
                                placeholder="LENGTH (CM)"
                                value={item.length || ""}
                                onChange={(e) => updateItem(index, 'length', e.target.value)}
                            />
                            <input
                                type="text"
                                className="p-2 border rounded text-primary-700 shadow"
                                placeholder="WEIGHT (KG)"
                                value={item.weight || ""}
                                onChange={(e) => handleNumberInput(e, index, 'weight')}
                            />
                        </div>
                        {item.steelSize && (
                            <div className="mt-2 text-sm text-primary-500">
                                Minimum weight per meter: {materials.sizes.find(s => s.size.toString() === item.steelSize)?.weightPerMeter || 0} kg/m
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
            <div className="pt-4 border-t mt-auto">
                <button
                    onClick={addItem}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default ProductSelection;