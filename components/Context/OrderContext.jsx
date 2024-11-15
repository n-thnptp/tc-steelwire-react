import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import useLoginContext from '../Hooks/useLoginContext';

const initialOrderState = {
    items: [{
        mt_id: 1,     // int, initialized as 0
        ms_id: 1,     // int, initialized as 0
        feature: "",   // string, initialized as empty string
        length: "",    // float, initialized as empty string for input
        weight: "",    // float, initialized as empty string for input
        price: 0
    }],
    currentWeight: 0,
    materials: [],
    sizes: [],
};

const OrderContext = createContext({
    orderState: initialOrderState,
    error: "",
    loading: false,
    addItem: () => { },
    removeItem: () => { },
    updateItem: () => { },
    handleConfirm: () => { }
});

export const OrderProvider = ({ children }) => {
    const router = useRouter();
    const { user } = useLoginContext();
    const [orderState, setOrderState] = useState(initialOrderState);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const maxWeight = 3800;

    // Fetch available materials and sizes on mount
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await fetch('/api/order/materials');
                const data = await response.json();

                setOrderState(prev => ({
                    ...prev,
                    materials: data.materialTypes,
                    sizes: data.sizes
                }));
            } catch (err) {
                setError("Failed to load materials. Please refresh the page.");
            }
        };

        fetchMaterials();
    }, []);

    const validateItem = (item) => {
        return item.ms_id && item.feature && item.length && item.weight;
    };

    const addItem = () => {
        if (orderState.currentWeight >= maxWeight) {
            setError("ไม่สามารถเพิ่มสินค้าได้ เนื่องจากน้ำหนักครบ 3.8 ตันแล้ว");
            return;
        }

        const lastItem = orderState.items[orderState.items.length - 1];
        if (!validateItem(lastItem)) {
            setError("กรุณากรอกข้อมูลให้ครบทุกฟิลด์ก่อนเพิ่มสินค้าใหม่");
            return;
        }

        setOrderState(prev => ({
            ...prev,
            items: [...prev.items, {
                mt_id: 1,     // int, initialized as 0
                ms_id: 1,     // int, initialized as 0
                feature: "",   // string, initialized as empty string
                length: "",    // float, initialized as empty string for input
                weight: "",    // float, initialized as empty string for input
                price: 0
            }]
        }));
        setError("");
    };

    const removeItem = (index) => {
        if (orderState.items.length === 1) {
            return;
        }

        setOrderState(prev => {
            const newItems = [...prev.items];
            newItems.splice(index, 1);
            const newWeight = newItems.reduce((acc, item) => acc + (parseFloat(item.weight) || 0), 0);
            return {
                ...prev,
                items: newItems,
                currentWeight: newWeight
            };
        });
    };

    const updateItem = (index, field, value, materials) => {
        setOrderState(prev => {
            const newItems = [...prev.items];

            // Update the specific field while preserving other values
            newItems[index] = {
                ...newItems[index],
                [field]: field === 'mt_id' || field === 'ms_id'
                    ? parseInt(value) || 0
                    : field === 'feature'
                        ? value
                        : value
            };

            // Calculate new total weight
            const newWeight = newItems.reduce((acc, item) =>
                acc + (parseFloat(item.weight) || 0), 0
            );

            // Update price if materials is provided and relevant fields change
            if (materials) {
                if (field === "ms_id" || field === "weight") {
                    newItems[index].price = materials.sizes.find(p => p.id === newItems[index].ms_id)?.price * (newItems[index].weight || 0);
                }
                if (field === "mt_id") {
                    newItems[index].materialType = materials.materialTypes.find(t => t.id === newItems[index].mt_id)?.name;
                }
            }

            return {
                ...prev,
                items: newItems,
                currentWeight: newWeight
            };
        });
        setError("");
    };

    const validateOrder = async (items) => {
        try {
            const response = await fetch('/api/order/validate_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: items.map(item => ({
                        mt_id: item.mt_id,
                        ms_id: item.ms_id,
                        weight: parseFloat(item.weight)
                    }))
                })
            });

            const data = await response.json();
            return data.success;
        } catch (err) {
            console.error('Validation error:', err);
            return false;
        }
    };

    const handleConfirm = async (e) => {
        e?.preventDefault();

        if (!user) {
            setError("Please login to place an order");
            router.push('/login');
            return;
        }

        const incompleteItem = orderState.items.some(item => !validateItem(item));
        if (incompleteItem) {
            setError("กรุณากรอกข้อมูลให้ครบทุกฟิลด์ก่อนยืนยันการสั่งซื้อ");
            return;
        }

        if (orderState.currentWeight > maxWeight) {
            setError(`ไม่สามารถสั่งซื้อได้เนื่องจากน้ำหนักรวมเกิน 3.8 ตัน (${maxWeight} KG)`);
            return;
        }

        setLoading(true);
        
        try {
            // Validate order first
            const isValid = await validateOrder(orderState.items);
            if (!isValid) {
                setError("สินค้าบางรายการไม่มีในสต็อก กรุณาตรวจสอบอีกครั้ง");
                return;
            }

            // Calculate total price based on weight and material prices
            const total_price = orderState.items.reduce((total, item) => {
                const size = orderState.sizes.find(s => s.id === item.sm_id);
                return total + (parseFloat(item.weight) * (size?.price || 0));
            }, 0);

            // Create order
            const response = await fetch('/api/order/add_to_cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_id: user.id,
                    products: orderState.items.map(item => ({
                        mt_id: item.mt_id,
                        ms_id: item.ms_id,
                        feature: item.feature,
                        length: parseFloat(item.length),
                        weight: parseFloat(item.weight).toFixed(2)
                    }))
                })
            });

            
            const data = await response.json();

            
            if (data.success) {
                setOrderState({
                    ...initialOrderState,
                    materials: orderState.materials,
                    sizes: orderState.sizes
                });
                setError("");
                alert("สั่งซื้อสำเร็จ!");
                router.push('/purchase');
            } else {
                throw new Error(data.message || 'Failed to create order');
            }
        } catch (err) {
            console.error('Order creation error:', err);
            setError("เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrderContext.Provider
            value={{
                orderState,
                error,
                loading,
                addItem,
                removeItem,
                updateItem,
                handleConfirm
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContext;