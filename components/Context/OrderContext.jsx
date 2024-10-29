import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const initialOrderState = {
    items: [{
        product: "PC WIRE",
        steelSize: "",
        steelFeature: "",
        length: "",
        weight: "",
        sm_id: "" // Added for backend integration
    }],
    currentWeight: 0,
    materials: [], // Available materials
    sizes: [], // Available sizes
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
        return item.steelSize && item.steelFeature && item.length && item.weight;
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
                product: "PC WIRE",
                steelSize: "",
                steelFeature: "",
                length: "",
                weight: "",
                sm_id: ""
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

    const updateItem = (index, field, value) => {
        setOrderState(prev => {
            const newItems = [...prev.items];
            newItems[index] = {
                ...newItems[index],
                [field]: value
            };

            // If updating steel size, find and set the corresponding sm_id
            if (field === 'steelSize') {
                const size = prev.sizes.find(s => s.size.toString() === value.toString());
                if (size) {
                    newItems[index].sm_id = size.id;
                }
            }

            if (field === 'weight') {
                const newWeight = newItems.reduce((acc, item) => acc + (parseFloat(item.weight) || 0), 0);
                return {
                    ...prev,
                    items: newItems,
                    currentWeight: newWeight
                };
            }

            return {
                ...prev,
                items: newItems
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
                        sm_id: item.sm_id,
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
            const response = await fetch('/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_id: 1, // You should get this from your login context
                    total_price,
                    products: orderState.items.map(item => ({
                        feature: item.steelFeature,
                        weight: parseFloat(item.weight),
                        length: parseFloat(item.length),
                        sm_id: item.sm_id
                    }))
                })
            });

            const data = await response.json();

            console.log(data)
            if (data.success) {
                setOrderState(initialOrderState);
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