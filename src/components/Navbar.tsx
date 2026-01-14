import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/directory', label: 'Alumni Directory' },
        { path: '/career', label: 'Career Hub' },
        { path: '/events', label: 'Events' },
        { path: '/giving', label: 'Give Back' },
        { path: '/store', label: 'Store' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <h2>NSM OSA</h2>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="navbar-links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="navbar-actions">
                        <Link to="/login">
                            <Button variant="outline" size="sm">
                                Login
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm">
                                Join Network
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="navbar-toggle"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="navbar-mobile">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="navbar-mobile-actions">
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" size="md" fullWidth>
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register" onClick={() => setIsOpen(false)}>
                                <Button variant="primary" size="md" fullWidth>
                                    Join Network
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
