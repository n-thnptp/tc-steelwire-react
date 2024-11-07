import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useLoginContext from '../Hooks/useLoginContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useLoginContext();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Check localStorage for user data
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            const userFromStorage = savedUser ? JSON.parse(savedUser) : null;
            console.log('AdminRoute - User from storage:', userFromStorage);
            
            if (!userFromStorage) {
                console.log('AdminRoute - No user in storage, redirecting to login');
                router.replace('/login');
            } else if (userFromStorage.role_id !== 2) {
                console.log('AdminRoute - Non-admin user, redirecting to home');
                router.replace('/');
            }
        }
    }, []);

    // Don't render anything during SSR or initial mount
    if (!mounted || loading) {
        return null;
    }

    // Check both context and localStorage
    const currentUser = user || (typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('user') || 'null')
        : null);

    if (!currentUser) {
        console.log('AdminRoute - No user found');
        return null;
    }

    if (currentUser.role_id !== 2) {
        console.log('AdminRoute - User is not admin');
        return null;
    }

    console.log('AdminRoute - Rendering admin content');
    return children;
};

export default AdminRoute;