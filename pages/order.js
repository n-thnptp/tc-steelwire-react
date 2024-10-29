import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useLoginContext from '../components/Hooks/useLoginContext';
import OrderForm from '../components/OrderPage/OrderForm';

export default function OrderPage() {
    const { user, loading } = useLoginContext();
    const router = useRouter();

    useEffect(() => {
        // If not loading and no user, redirect to login
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // If not authenticated, don't render anything (redirect will happen)
    if (!user) {
        return null;
    }

    // If authenticated, render the order form
    return <OrderForm />;
}
