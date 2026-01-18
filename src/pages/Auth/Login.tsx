import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { signIn, AuthError } from '../../services/authService';

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setError('');
        setLoading(true);

        try {
            await signIn(data.email, data.password);
            // Redirect to dashboard or home after successful login
            navigate('/dashboard');
        } catch (err) {
            const authError = err as AuthError;
            setError(authError.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-16">
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h1 className="text-center">Login</h1>
                <p className="text-center mb-8">Welcome back to the NSM OSA Network</p>
                
                {error && (
                    <div style={{
                        padding: '12px',
                        marginBottom: '16px',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="your.email@example.com"
                        error={errors.email?.message}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                    />
                    <Button 
                        variant="primary" 
                        size="lg" 
                        fullWidth 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <Link to="/register" style={{ color: 'var(--color-accent)' }}>Register</Link>
                </p>
                <p className="text-center mt-2" style={{ fontSize: '14px', color: '#666' }}>
                    Having trouble? Contact us at <a href="mailto:alumininsm@gmail.com" style={{ color: 'var(--color-accent)' }}>alumininsm@gmail.com</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
