import { useRouter } from 'next/router';
import PaymentPage from '../../components/PurchasePage/PaymentPage/PaymentPage';

export default function Payment() {
    const router = useRouter();
    const { orderId } = router.query;

    if (!router.isReady) {
        return <div className="min-h-screen bg-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <PaymentPage orderId={orderId} />
        </div>
    );
} 