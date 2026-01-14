import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';

const Register: React.FC = () => {
    return (
        <div className="container py-16">
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h1 className="text-center">Join the Network</h1>
                <p className="text-center mb-8">Connect with fellow NSM OSA members</p>
                <form>
                    <Input label="Full Name" type="text" placeholder="John Doe" />
                    <Input label="Email" type="email" placeholder="your.email@example.com" />
                    <Input label="Batch Year" type="text" placeholder="2020" />
                    <Input label="Password" type="password" placeholder="••••••••" />
                    <Button variant="primary" size="lg" fullWidth type="submit">
                        Register
                    </Button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-accent)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
