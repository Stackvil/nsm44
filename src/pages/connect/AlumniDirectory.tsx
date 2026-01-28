import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AlumniDirectory: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = () => {
            const role = sessionStorage.getItem('nsm_user_role');
            const isAdmin = ['admin', 'super-admin', 'representative'].includes(role || '');
            const loggedIn = sessionStorage.getItem('nsm_user_logged_in') === 'true' ||
                sessionStorage.getItem('nsm_is_logged_in') === 'true' ||
                (window as any).isUserLoggedIn === true ||
                isAdmin;
            setIsLoggedIn(loggedIn);
        };
        checkLogin();
        const interval = setInterval(checkLogin, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="container py-16">
                <div style={{
                    background: '#fff',
                    borderRadius: '15px',
                    padding: '60px 40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00274d, #004080)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: '36px',
                        color: '#fff'
                    }}>
                        <i className="fas fa-lock"></i>
                    </div>
                    <h4 style={{ fontSize: '24px', fontWeight: '600', color: '#00274d', marginBottom: '1rem' }}>
                        Login Required
                    </h4>
                    <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Please login to view Alumni Directory.
                    </p>
                    <Link to="/login">
                        <button style={{
                            padding: '14px 40px',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: '#00274d',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            margin: '0 auto'
                        }}>
                            <i className="fas fa-sign-in-alt"></i> Sign In to Access
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>Alumni Directory</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem' }}>
                Search and connect with NSMOSA alumni from around the world.
            </p>
            <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <p style={{ color: '#666', textAlign: 'center' }}>
                    Alumni directory will be available here. Content migrated from index.html.
                </p>
            </div>
        </div>
    );
};

export default AlumniDirectory;
