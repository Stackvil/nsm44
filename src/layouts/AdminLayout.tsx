import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/admin.css';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check for token
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            navigate('/admin/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            // Basic role check - detailed check on backend
            if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'SUPER_ADMIN') {
                localStorage.clear(); // Clear invalid session
                navigate('/admin/login'); // Redirect to login
                return;
            }
            setUser(parsedUser);
        } catch (e) {
            navigate('/admin/login');
        }

        // Add admin-body class to body
        document.body.classList.add('admin-body');

        return () => {
            document.body.classList.remove('admin-body');
        };
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    if (!user) return null;

    return (
        <div className="admin-wrapper">
            {/* Header */}
            <div className="admin-header">
                <h1>
                    <i className="fas fa-shield-alt"></i>
                    NSM Alumni Admin
                </h1>
                <div className="user-info">
                    <div className="user-badge">
                        <i className="fas fa-user"></i>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span>{user.firstName} {user.lastName}</span>
                            <span style={{ fontSize: '11px', color: 'var(--gray-500)', fontWeight: 500 }}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-nav-tabs">
                <div className="nav-tabs-container">
                    <Link to="/admin" className={`nav-tab-btn ${location.pathname === '/admin' ? 'active' : ''}`}>
                        <i className="fas fa-edit"></i> Content Management
                    </Link>
                    {/* Add more tabs as features are implemented */}
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-container">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
