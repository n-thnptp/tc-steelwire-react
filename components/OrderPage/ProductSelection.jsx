import React, { useEffect, useState } from 'react';
import useOrderContext from '../Hooks/useOrderContext';
import { IconButton } from "@material-tailwind/react";
import { calculateMinimumWeight, getMinWeightPerMeters } from '../Utils/weightCalculations';
import { IoCloseCircleOutline } from "react-icons/io5";

const ProductSelection = () => {
    const { orderState, addItem, updateItem, removeItem } = useOrderContext();
    const [materials, setMaterials] = useState(null);
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


    const handleNumberOnly = (e, index, field, materials) => {
        // const value = e.target.value.replace(/[^\d]/g, '');
        let value = e.target.value;

        let number;
        // if (value === '0') {
        //     alert(`${field.charAt(0).toUpperCase() + field.slice(1)} ค่าไม่สามารถเป็น 0 ได้`);
        //     return;
        // }
        try {
            number = parseFloat(value).toFixed(2);
        } catch (e) {
            return;
        }

        updateItem(index, field, number, materials);

        // updateItem(index, field, value === '' ? '' : parseFloat(value), materials);

        // if (field === 'weight' && value) {
        //     const newWeight = parseFloat(value);
        //     const otherItemsWeight = orderState.items.reduce((acc, item, idx) =>
        //         idx !== index ? acc + (parseFloat(item.weight) || 0) : acc, 0);
        //     const totalWeight = newWeight + otherItemsWeight;

        // if (totalWeight > 3800) {
        //     alert("น้ำหนักรวมต้องไม่เกิน 3.8 ตัน (3800 KG)");
        //     return;
        // }

        // const currentItem = orderState.items[index];
        // if (currentItem.length && currentItem.ms_id) {
        //     const minWeight = calculateMinimumWeight(currentItem.length, currentItem.ms_id);
        //     if (newWeight < parseFloat(minWeight)) {
        //         alert(`น้ำหนักต้องไม่น้อยกว่า ${minWeight} KG สำหรับขนาด ${currentItem.ms_id}mm และความยาว ${(parseFloat(currentItem.length) / 100).toFixed(2)}m`);
        //     }
        // }
    }


    if (loading) {
        return <div className="w-full text-center">Loading...</div>;
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
                                value={item.mt_id || ""}
                                onChange={(e) => updateItem(index, 'mt_id', parseInt(e.target.value), materials)}
                            >
                                {materials.materialTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        PC {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            <select
                                className="p-2 border rounded text-primary-700 shadow"
                                value={item.ms_id}
                                onChange={(e) => updateItem(index, 'ms_id', e.target.value, materials)}
                            >
                                <option value="" disabled>SIZE</option>
                                {materials.sizes.map(size => (
                                    <option key={size.id} value={size.id}>
                                        {size.size} MM
                                    </option>
                                ))}
                            </select>
                            <select
                                className="p-2 border rounded text-primary-700 shadow"
                                value={item.feature || ""}
                                onChange={(e) => updateItem(index, 'feature', e.target.value, materials)}
                            >
                                <option value="" disabled>FEATURE</option>
                                <option value="Indented">Indented</option>
                                <option value="Plain">Plain</option>
                            </select>
                            <input
                                type="number"
                                className="p-2 border rounded text-primary-700 shadow"
                                placeholder="LENGTH (CM)"
                                min={100}
                                onChange={(e) => handleNumberOnly(e, index, 'length', materials)}
                            />
                            <input
                                type="number"
                                className="p-2 border rounded text-primary-700 shadow"
                                min="0"
                                placeholder="WEIGHT (KG)"
                                onChange={(e) => handleNumberOnly(e, index, 'weight', materials)}
                            />
                        </div>
                        {item.ms_id !== 0 && (
                            <div className="mt-2 text-sm text-primary-500">
                                Minimum weight per meter: {getMinWeightPerMeters(item.ms_id)} kg/m
                            </div>
                        )}
                        {item.ms_id !== 0 && (
                            <div className="mt-1 text-sm text-primary-500">
                                Minimum total weight for this length: {calculateMinimumWeight(parseFloat(item.length), item.ms_id)} kg
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