import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>NSM OSA</h3>
                        <p className="footer-description">
                            Connecting generations of alumni to foster lifelong relationships,
                            career growth, and institutional support.
                        </p>
                        <div className="footer-social">
                            <a href="#" aria-label="Facebook" className="footer-social-link">
                                <Facebook size={20} />
                            </a>
                            <a href="#" aria-label="Twitter" className="footer-social-link">
                                <Twitter size={20} />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="footer-social-link">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://www.instagram.com/nsm_alumni?igsh=MXBzcDd3NzI2eW0xcg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-link">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/directory">Alumni Directory</Link></li>
                            <li><Link to="/career">Career Hub</Link></li>
                            <li><Link to="/events">Events</Link></li>
                            <li><Link to="/giving">Give Back</Link></li>
                            <li><Link to="/store">Memento Store</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Resources</h4>
                        <ul className="footer-links">
                            <li><Link to="/dashboard">My Dashboard</Link></li>
                            <li><Link to="#">Newsletter</Link></li>
                            <li><Link to="#">Privacy Policy</Link></li>
                            <li><Link to="#">Terms of Service</Link></li>
                            <li><Link to="#">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <ul className="footer-contact">
                            <li>
                                <Mail size={16} />
                                <span>alumni@nsm.edu</span>
                            </li>
                            <li>
                                <Phone size={16} />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li>
                                <MapPin size={16} />
                                <span>123 University Ave, Campus City, ST 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} NSM OSA. All rights reserved.</p>
                    <p>Built with pride for our alumni community.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
