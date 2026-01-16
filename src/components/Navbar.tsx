import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;
    const isActiveParent = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

    const toggleDropdown = (dropdown: string) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const aboutLinks = [
        { path: '/about/overview', label: 'About NSMOSA' },
        { path: '/about/president', label: "President's Message" },
        { path: '/about/executive-committee', label: 'Executive Committee' },
        { path: '/about/chapters', label: 'Alumni Chapters' },
        { path: '/about/benefits', label: 'Alumni Benefits' },
        { path: '/about/annual-reports', label: 'NSMOSA Annual Reports' },
    ];

    const connectLinks = [
        { path: '/connect/profile', label: 'My Profile' },
        { path: '/connect/alumni-event', label: 'Alumni Event' },
        { path: '/connect/alumni-directory', label: 'Alumni Directory' },
        { path: '/connect/business-directory', label: 'Business Directory' },
        { path: '/connect/how-to-give', label: 'How to Give' },
        { path: '/connect/connect-us', label: 'Connect With Us' },
    ];

    const reunionLinks = [
        { path: '/reunion/about', label: 'About Reunion' },
        { path: '/reunion/gallery', label: 'Photo Gallery Reunion' },
    ];

    const galleryLinks = [
        { path: '/gallery/photo', label: 'Photo Gallery' },
        { path: '/gallery/video', label: 'Video Gallery' },
    ];

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <h2>NSMOSA</h2>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="navbar-links">
                        <Link
                            to="/"
                            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                        >
                            Home
                        </Link>

                        {/* About NSMOSA Dropdown */}
                        <div 
                            className="navbar-dropdown"
                            onMouseEnter={() => setOpenDropdown('about')}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                to="/about"
                                className={`navbar-link ${isActiveParent(['/about']) ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('about');
                                }}
                            >
                                About NSMOSA
                                <ChevronDown size={16} style={{ marginLeft: '4px' }} />
                            </Link>
                            {openDropdown === 'about' && (
                                <div className="navbar-dropdown-menu">
                                    {aboutLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`navbar-dropdown-item ${isActive(link.path) ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* NSMOSA Alumni Connect Dropdown */}
                        <div 
                            className="navbar-dropdown"
                            onMouseEnter={() => setOpenDropdown('connect')}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                to="/connect/profile"
                                className={`navbar-link ${isActiveParent(['/connect']) ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('connect');
                                }}
                            >
                                NSMOSA Alumni Connect
                                <ChevronDown size={16} style={{ marginLeft: '4px' }} />
                            </Link>
                            {openDropdown === 'connect' && (
                                <div className="navbar-dropdown-menu">
                                    {connectLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`navbar-dropdown-item ${isActive(link.path) ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            to="/events"
                            className={`navbar-link ${isActive('/events') ? 'active' : ''}`}
                        >
                            NSMOSA Alumni Events
                        </Link>

                        {/* Re-Union Dropdown */}
                        <div 
                            className="navbar-dropdown"
                            onMouseEnter={() => setOpenDropdown('reunion')}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                to="/reunion"
                                className={`navbar-link ${isActiveParent(['/reunion']) ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('reunion');
                                }}
                            >
                                Re-Union
                                <ChevronDown size={16} style={{ marginLeft: '4px' }} />
                            </Link>
                            {openDropdown === 'reunion' && (
                                <div className="navbar-dropdown-menu">
                                    {reunionLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`navbar-dropdown-item ${isActive(link.path) ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Gallery Dropdown */}
                        <div 
                            className="navbar-dropdown"
                            onMouseEnter={() => setOpenDropdown('gallery')}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                to="/gallery"
                                className={`navbar-link ${isActiveParent(['/gallery']) ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown('gallery');
                                }}
                            >
                                Gallery
                                <ChevronDown size={16} style={{ marginLeft: '4px' }} />
                            </Link>
                            {openDropdown === 'gallery' && (
                                <div className="navbar-dropdown-menu">
                                    {galleryLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`navbar-dropdown-item ${isActive(link.path) ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            to="/faq"
                            className={`navbar-link ${isActive('/faq') ? 'active' : ''}`}
                        >
                            FAQ's
                        </Link>

                        <Link
                            to="/member"
                            className={`navbar-link nav-donate-btn ${isActive('/member') ? 'active' : ''}`}
                        >
                            <i className="fas fa-user-plus" style={{ marginRight: '4px' }}></i>
                            Become A Member
                        </Link>

                        <Link
                            to="/contact"
                            className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
                        >
                            Contact Us
                        </Link>
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
                        <Link
                            to="/"
                            className={`navbar-mobile-link ${isActive('/') ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>

                        {/* Mobile About Dropdown */}
                        <div className="navbar-mobile-dropdown">
                            <button
                                className="navbar-mobile-link"
                                onClick={() => toggleDropdown('about-mobile')}
                            >
                                About NSMOSA <ChevronDown size={16} />
                            </button>
                            {openDropdown === 'about-mobile' && (
                                <div className="navbar-mobile-dropdown-menu">
                                    {aboutLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Connect Dropdown */}
                        <div className="navbar-mobile-dropdown">
                            <button
                                className="navbar-mobile-link"
                                onClick={() => toggleDropdown('connect-mobile')}
                            >
                                NSMOSA Alumni Connect <ChevronDown size={16} />
                            </button>
                            {openDropdown === 'connect-mobile' && (
                                <div className="navbar-mobile-dropdown-menu">
                                    {connectLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            to="/events"
                            className={`navbar-mobile-link ${isActive('/events') ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            NSMOSA Alumni Events
                        </Link>

                        {/* Mobile Reunion Dropdown */}
                        <div className="navbar-mobile-dropdown">
                            <button
                                className="navbar-mobile-link"
                                onClick={() => toggleDropdown('reunion-mobile')}
                            >
                                Re-Union <ChevronDown size={16} />
                            </button>
                            {openDropdown === 'reunion-mobile' && (
                                <div className="navbar-mobile-dropdown-menu">
                                    {reunionLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Gallery Dropdown */}
                        <div className="navbar-mobile-dropdown">
                            <button
                                className="navbar-mobile-link"
                                onClick={() => toggleDropdown('gallery-mobile')}
                            >
                                Gallery <ChevronDown size={16} />
                            </button>
                            {openDropdown === 'gallery-mobile' && (
                                <div className="navbar-mobile-dropdown-menu">
                                    {galleryLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            to="/faq"
                            className={`navbar-mobile-link ${isActive('/faq') ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            FAQ's
                        </Link>

                        <Link
                            to="/member"
                            className={`navbar-mobile-link ${isActive('/member') ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            Become A Member
                        </Link>

                        <Link
                            to="/contact"
                            className={`navbar-mobile-link ${isActive('/contact') ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            Contact Us
                        </Link>

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
