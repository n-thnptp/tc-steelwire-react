import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useLoginContext from '../hooks/useLoginContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useLoginContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show loading state or nothing while checking authentication
    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // If authenticated, render the protected content
    return children;
};

export default ProtectedRoute;