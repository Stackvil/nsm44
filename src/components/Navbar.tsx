import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

const Navbar: React.FC = () => {

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;
    const isActiveParent = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setOpenDropdown(null);
    };

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
                                            onClick={() => { }}
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
                                            onClick={() => { }}
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
                                            onClick={() => { }}
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
                                            onClick={() => { }}
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

                    {/* Mobile Toggle Button */}
                    <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`navbar-mobile-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} />
            <div className={`navbar-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <Link to="/" onClick={toggleMenu}><h2>NSMOSA</h2></Link>
                    <button onClick={toggleMenu}><X size={24} /></button>
                </div>
                <div className="mobile-menu-links">
                    <Link to="/" className="mobile-menu-item" onClick={toggleMenu}>
                        HOME
                    </Link>

                    <div className="mobile-menu-dropdown">
                        <button className="mobile-menu-item" onClick={(e) => { e.stopPropagation(); toggleDropdown('about'); }}>
                            ABOUT NSMOSA
                            <ChevronDown size={20} className={openDropdown === 'about' ? 'rotate' : ''} />
                        </button>
                        <div className={`mobile-dropdown-content ${openDropdown === 'about' ? 'open' : ''}`}>
                            {aboutLinks.map(link => (
                                <Link key={link.path} to={link.path} className="mobile-dropdown-item" onClick={toggleMenu}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mobile-menu-dropdown">
                        <button className="mobile-menu-item" onClick={(e) => { e.stopPropagation(); toggleDropdown('connect'); }}>
                            ALUMNI CONNECT
                            <ChevronDown size={20} className={openDropdown === 'connect' ? 'rotate' : ''} />
                        </button>
                        <div className={`mobile-dropdown-content ${openDropdown === 'connect' ? 'open' : ''}`}>
                            {connectLinks.map(link => (
                                <Link key={link.path} to={link.path} className="mobile-dropdown-item" onClick={toggleMenu}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link to="/events" className="mobile-menu-item" onClick={toggleMenu}>
                        ALUMNI EVENTS
                    </Link>

                    <div className="mobile-menu-dropdown">
                        <button className="mobile-menu-item" onClick={(e) => { e.stopPropagation(); toggleDropdown('reunion'); }}>
                            RE-UNION
                            <ChevronDown size={20} className={openDropdown === 'reunion' ? 'rotate' : ''} />
                        </button>
                        <div className={`mobile-dropdown-content ${openDropdown === 'reunion' ? 'open' : ''}`}>
                            {reunionLinks.map(link => (
                                <Link key={link.path} to={link.path} className="mobile-dropdown-item" onClick={toggleMenu}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mobile-menu-dropdown">
                        <button className="mobile-menu-item" onClick={(e) => { e.stopPropagation(); toggleDropdown('gallery'); }}>
                            GALLERY
                            <ChevronDown size={20} className={openDropdown === 'gallery' ? 'rotate' : ''} />
                        </button>
                        <div className={`mobile-dropdown-content ${openDropdown === 'gallery' ? 'open' : ''}`}>
                            {galleryLinks.map(link => (
                                <Link key={link.path} to={link.path} className="mobile-dropdown-item" onClick={toggleMenu}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link to="/faq" className="mobile-menu-item" onClick={toggleMenu}>
                        FAQ's
                    </Link>

                    <Link to="/member" className="mobile-menu-item donate" onClick={toggleMenu}>
                        BECOME A MEMBER
                    </Link>

                    <Link to="/contact" className="mobile-menu-item" onClick={toggleMenu}>
                        CONTACT US
                    </Link>

                    <div className="mobile-menu-actions">
                        <Link to="/login" onClick={toggleMenu}>
                            <Button variant="outline" fullWidth>Login</Button>
                        </Link>
                        <Link to="/register" onClick={toggleMenu}>
                            <Button variant="primary" fullWidth>Join Network</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
