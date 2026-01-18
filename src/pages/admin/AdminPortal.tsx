import React, { useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const AdminPortal: React.FC = () => {
    useEffect(() => {
        // Show body for admin pages
        document.body.style.display = '';
    }, []);

    // AdminLayout handles authentication internally and uses Outlet for nested routes
    return <AdminLayout />;
};

export default AdminPortal;