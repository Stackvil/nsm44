import React from 'react';
import { Link } from 'react-router-dom';

const Connect: React.FC = () => {
    const sections = [
        {
            path: '/connect/profile',
            title: 'My Profile',
            description: 'Manage your alumni profile and information',
            icon: 'fas fa-user',
            requiresLogin: true
        },
        {
            path: '/connect/alumni-event',
            title: 'Alumni Event',
            description: 'Join upcoming alumni events and reunions',
            icon: 'fas fa-calendar-alt'
        },
        {
            path: '/connect/alumni-directory',
            title: 'Alumni Directory',
            description: 'Search and connect with fellow alumni',
            icon: 'fas fa-address-book'
        },
        {
            path: '/connect/business-directory',
            title: 'Business Directory',
            description: 'Discover businesses owned by alumni',
            icon: 'fas fa-building'
        },
        {
            path: '/connect/how-to-give',
            title: 'How to Give',
            description: 'Support NSMOSA through donations and volunteering',
            icon: 'fas fa-donate'
        },
        {
            path: '/connect/connect-us',
            title: 'Connect With Us',
            description: 'Get in touch with the alumni association',
            icon: 'fas fa-phone-alt'
        }
    ];

    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '1rem' }}>NSMOSA Alumni Connect</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem', maxWidth: '800px' }}>
                Connect with fellow alumni, manage your profile, explore events, and stay engaged with the NSMOSA community.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginTop: '3rem'
            }}>
                {sections.map((section, index) => (
                    <Link
                        key={index}
                        to={section.path}
                        style={{
                            background: '#fff',
                            padding: '2rem',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            display: 'block',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                        }}
                    >
                        {section.requiresLogin && (
                            <span style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: '#ff6b35',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                Login Required
                            </span>
                        )}
                        <div style={{ fontSize: '3rem', color: '#00274d', marginBottom: '1rem' }}>
                            <i className={section.icon}></i>
                        </div>
                        <h3 style={{ 
                            marginBottom: '0.5rem', 
                            color: '#00274d',
                            fontSize: '1.25rem'
                        }}>
                            {section.title}
                        </h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            {section.description}
                        </p>
                        <div style={{ 
                            marginTop: '1rem', 
                            color: '#00274d',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            Explore <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Connect;
