import React from 'react';
import { Link } from 'react-router-dom';

const Reunion: React.FC = () => {
    const sections = [
        {
            path: '/reunion/about',
            title: 'About Reunion',
            description: 'Learn about our reunion events and traditions',
            icon: 'fas fa-info-circle'
        },
        {
            path: '/reunion/gallery',
            title: 'Photo Gallery Reunion',
            description: 'Browse photos from past reunions',
            icon: 'fas fa-images'
        }
    ];

    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '1rem' }}>Re-Union</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem', maxWidth: '800px' }}>
                Join us for reunions and reconnect with old friends, teachers, and classmates. Relive the memories and create new ones.
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
                            display: 'block'
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
                            Learn more <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Reunion;
