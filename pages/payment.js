import { useRouter } from 'next/router';
import PaymentPage from '../components/PurchasePage/PaymentPage/PaymentPage';

export default function Payment() {
    const router = useRouter();
    const { orderId } = router.query;

    if (!orderId) {
        return <div>Loading...</div>;
    }

    return <PaymentPage orderId={orderId} />;
}