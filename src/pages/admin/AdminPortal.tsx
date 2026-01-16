import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminLayout from '../../layouts/AdminLayout';

const AdminPortal: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Show body for admin pages
        document.body.style.display = '';
    }, []);

    if (isAuthenticated === null) {
        // Loading state
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ color: 'white', fontSize: '18px' }}>
                    <i className="fas fa-spinner fa-spin"></i> Loading...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return <AdminLayout><Outlet /></AdminLayout>;
};

export default AdminPortal;