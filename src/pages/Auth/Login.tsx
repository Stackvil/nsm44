import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';

const Login: React.FC = () => {
    return (
        <div className="container py-16">
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h1 className="text-center">Login</h1>
                <p className="text-center mb-8">Welcome back to the NSM OSA Network</p>
                <form>
                    <Input label="Email" type="email" placeholder="your.email@example.com" />
                    <Input label="Password" type="password" placeholder="••••••••" />
                    <Button variant="primary" size="lg" fullWidth type="submit">
                        Login
                    </Button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <Link to="/register" style={{ color: 'var(--color-accent)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
