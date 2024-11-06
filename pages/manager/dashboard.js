import { useEffect } from 'react';
import AdminRoute from '../../components/Auth/AdminRoute';
import useLoginContext from '../../components/Hooks/useLoginContext';

const ManagerDashboard = () => {
    const { user } = useLoginContext();

    useEffect(() => {
        console.log('Dashboard mounted - Current user:', user);
    }, [user]);

    return (
        <AdminRoute>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
                {/* Your dashboard content */}
            </div>
        </AdminRoute>
    );
};

export default ManagerDashboard;