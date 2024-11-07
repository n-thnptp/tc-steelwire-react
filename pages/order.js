import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useLoginContext from '../components/Hooks/useLoginContext';
import OrderForm from '../components/OrderPage/OrderForm';

export default function OrderPage() {
    const { user, loading } = useLoginContext();
    const router = useRouter();

    useEffect(() => {
        // Add more detailed logging
        console.log('OrderPage - Loading:', loading);
        console.log('OrderPage - User:', user);
        console.log('OrderPage - LocalStorage:', localStorage.getItem('user'));

        if (!loading) {
            if (!user) {
                console.log('OrderPage - No user, redirecting to login');
                router.push('/login');
            } else {
                console.log('OrderPage - User role:', user.role_id);
            }
        }
    }, [user, loading, router]);

    // Keep your existing loading and auth checks
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user || ![1, 2].includes(user.role_id)) {
        return null;
    }

    return <OrderForm />;
}
