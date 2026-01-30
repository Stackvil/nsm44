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

    const [members, setMembers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadMembers = () => {
            try {
                const stored = localStorage.getItem('nsm_alumni_directory');
                if (stored) {
                    setMembers(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to load directory", e);
            }
        };
        loadMembers();

        // Listen for storage changes in case admin updates in another tab
        window.addEventListener('storage', loadMembers);
        return () => window.removeEventListener('storage', loadMembers);
    }, []);

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '1rem', color: '#00274d', fontSize: '2.5rem', fontWeight: '700' }}>Alumni Directory</h1>
            <p style={{ marginBottom: '3rem', color: '#64748b', fontSize: '1.1rem' }}>
                Connect with NSMOSA alumni from around the world. Search by name, batch, or industry.
            </p>

            {/* Search Bar */}
            <div style={{ marginBottom: '40px', position: 'relative', maxWidth: '600px' }}>
                <i className="fas fa-search" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                    type="text"
                    placeholder="Search by name, role, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '16px 20px 16px 50px',
                        borderRadius: '50px',
                        border: '1px solid #e2e8f0',
                        fontSize: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        outline: 'none'
                    }}
                />
            </div>

            {members.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px',
                    background: '#f8fafc',
                    borderRadius: '16px',
                    color: '#64748b'
                }}>
                    <i className="fas fa-user-friends" style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}></i>
                    <h3>Directory is Empty</h3>
                    <p>No alumni members have been added yet.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '30px'
                }}>
                    {filteredMembers.map(member => (
                        <div key={member.id} style={{
                            background: '#fff',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            textAlign: 'center',
                            padding: '30px 20px',
                            border: '1px solid #f1f5f9'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)';
                            }}
                        >
                            <img
                                src={member.image || 'https://via.placeholder.com/150'}
                                alt={member.name}
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: '20px',
                                    border: '4px solid #f0f9ff',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}
                            />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                {member.name}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', minHeight: '3em' }}>
                                {member.position}
                            </p>
                            <button style={{
                                marginTop: '20px',
                                padding: '10px 24px',
                                background: '#00274d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#004e92'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#00274d'}
                            >
                                Connect
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlumniDirectory;
