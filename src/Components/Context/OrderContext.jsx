import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderContext = createContext({});

export const OrderProvider = ({ children }) => {
    const [orderState, setOrderState] = useState({
        items: [{
            product: "PC WIRE",
            steelSize: "",
            steelFeature: "",
            length: "",
            weight: ""
        }],
        currentWeight: 0
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const maxWeight = 3800; // 3.8 tons in kg

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
                weight: ""
            }]
        }));
        setError("");
    };

    const removeItem = (index) => {
        if (orderState.items.length === 1) {
            return; // Prevent removing the last item
        }

        setOrderState(prev => {
            const newItems = [...prev.items];
            newItems.splice(index, 1);
            const newWeight = newItems.reduce((acc, item) => acc + (parseFloat(item.weight) || 0), 0);
            return {
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

            if (field === 'weight') {
                const newWeight = newItems.reduce((acc, item) => acc + (parseFloat(item.weight) || 0), 0);
                return {
                    items: newItems,
                    currentWeight: newWeight
                };
            }

            return {
                ...prev,
                items: newItems
            };
        });
        setError(""); // Clear error when user updates any field
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
            // API call would go here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(orderState);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            setOrderState({
                items: [{
                    product: "PC WIRE",
                    steelSize: "",
                    steelFeature: "",
                    length: "",
                    weight: ""
                }],
                currentWeight: 0
            });
            setError("");
            alert("สั่งซื้อสำเร็จ!");
            navigate('/purchase'); // Navigate to purchase page after successful submission
        } catch (err) {
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