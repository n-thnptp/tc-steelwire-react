import OrderForm from '../Components/OrderPage/OrderForm';
import { OrderProvider } from '../Components/Context/OrderContext';

export default function OrderPage() {
    return (
        <OrderProvider>
            <OrderForm />
        </OrderProvider>
    );
}