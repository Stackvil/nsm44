import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { register, AuthError } from '../../services/authService';

interface RegisterFormData {
    fullName: string;
    email: string;
    batchYear: string;
    phoneNumber?: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    const {
        register: registerField,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<RegisterFormData>();

    const password = watch('password');

    const onSubmit = async (data: RegisterFormData) => {
        setError('');
        setLoading(true);

        try {
            await register(
                data.email,
                data.password,
                data.fullName,
                data.batchYear,
                data.phoneNumber
            );
            // Redirect to dashboard after successful registration
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
                <h1 className="text-center">Join the Network</h1>
                <p className="text-center mb-8">Connect with fellow NSM OSA members</p>
                
                <div style={{
                    padding: '12px',
                    marginBottom: '16px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: '4px',
                    fontSize: '14px'
                }}>
                    <strong>Note:</strong> Only existing NSM OSA members can register. If your email is not in our system, please contact us at <a href="mailto:alumininsm@gmail.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>alumininsm@gmail.com</a>
                </div>

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
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        error={errors.fullName?.message}
                        {...registerField('fullName', {
                            required: 'Full name is required',
                            minLength: {
                                value: 2,
                                message: 'Name must be at least 2 characters'
                            }
                        })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="your.email@example.com"
                        error={errors.email?.message}
                        {...registerField('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                    <Input
                        label="Batch Year"
                        type="text"
                        placeholder="2020"
                        error={errors.batchYear?.message}
                        {...registerField('batchYear', {
                            required: 'Batch year is required',
                            pattern: {
                                value: /^\d{4}$/,
                                message: 'Please enter a valid 4-digit year'
                            }
                        })}
                    />
                    <Input
                        label="Phone Number (Optional)"
                        type="tel"
                        placeholder="+91 9876543210"
                        error={errors.phoneNumber?.message}
                        {...registerField('phoneNumber', {
                            pattern: {
                                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                                message: 'Please enter a valid phone number'
                            }
                        })}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...registerField('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        {...registerField('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: value => value === password || 'Passwords do not match'
                        })}
                    />
                    <Button 
                        variant="primary" 
                        size="lg" 
                        fullWidth 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
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
