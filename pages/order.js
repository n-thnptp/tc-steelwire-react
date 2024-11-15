import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useLoginContext from '../components/Hooks/useLoginContext';
import OrderForm from '../components/OrderPage/OrderForm';

export default function OrderPage() {
    const { user, loading } = useLoginContext();
    const router = useRouter();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Check localStorage immediately
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        
        if (!loading) {
            if (!user && !parsedUser) {
                router.push('/login');
            } else if (parsedUser && parsedUser.role_id === 1) {
                // Valid user found in localStorage
                setIsInitialized(true);
            }
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading || !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Check both context and localStorage
    const storedUser = localStorage.getItem('user');
    const effectiveUser = user || (storedUser ? JSON.parse(storedUser) : null);

    if (!effectiveUser || effectiveUser.role_id !== 1) {
        router.push('/login');
        return null;
    }

    return <OrderForm />;
}
