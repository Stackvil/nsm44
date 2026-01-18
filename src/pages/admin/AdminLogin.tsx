import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/admin.css';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Using localStorage-based auth (no backend)
            const res = await api.post('/auth/login', { username, password });

            // Check if response data exists
            if (!res.data?.data) {
                setError('Invalid response from server. Please try again.');
                setLoading(false);
                return;
            }

            const responseData = res.data.data;

            // Verify role
            if (responseData.user?.role !== 'ADMIN' && responseData.user?.role !== 'SUPER_ADMIN') {
                setError('Access denied. Admin privileges required.');
                setLoading(false);
                return;
            }

            // Store token and user info
            if (responseData.token) {
                localStorage.setItem('token', responseData.token);
            }
            if (responseData.user) {
                localStorage.setItem('user', JSON.stringify(responseData.user));
            }

            // Redirect to admin dashboard
            navigate('/admin');
        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div className="login-container">
                <div className="login-header">
                    <div className="login-icon">
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    <h1>Admin Access</h1>
                    <p>Secure Login Required</p>
                </div>

                {error && (
                    <div className="error-message show">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-icon">
                            <i className="fas fa-user"></i>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-icon">
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing In...' : (
                            <>
                                <i className="fas fa-sign-in-alt"></i> Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="security-note">
                    <i className="fas fa-info-circle"></i>
                    <strong>Security Notice:</strong> This is a restricted area. Unauthorized access is prohibited.
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
