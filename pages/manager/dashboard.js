import { useEffect } from 'react';
import AdminRoute from '../../components/Auth/AdminRoute';
import useLoginContext from '../../components/Hooks/useLoginContext';
import ManagerDashboard from '../../components/Manager/Dashboard/Dashboard';

const ManagerDashboardPage = () => {
    const { user } = useLoginContext();

    useEffect(() => {
    }, [user]);

    return (
        <AdminRoute>
            <ManagerDashboard />
        </AdminRoute>
    );
};

export default ManagerDashboardPage;