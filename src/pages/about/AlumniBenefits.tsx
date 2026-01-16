import React from 'react';

const AlumniBenefits: React.FC = () => {
    const benefits = [
        {
            icon: 'fas fa-book',
            title: 'Library Access',
            description: 'Access to our extensive library resources and periodical databases.'
        },
        {
            icon: 'fas fa-graduation-cap',
            title: 'Educational Amenities',
            description: 'Use of certain labs and equipment on campus for continued learning.'
        },
        {
            icon: 'fas fa-network-wired',
            title: 'Networking Opportunities',
            description: 'Connect with fellow alumni through events and online platforms.'
        },
        {
            icon: 'fas fa-briefcase',
            title: 'Career Support',
            description: 'Access to job postings, career counseling, and mentorship programs.'
        }
    ];

    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>Alumni Benefits</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem' }}>
                As a member of NSMOSA, you enjoy exclusive benefits designed to support your personal and professional growth.
            </p>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {benefits.map((benefit, index) => (
                    <div 
                        key={index}
                        style={{ 
                            background: '#fff',
                            padding: '2rem',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            textAlign: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s'
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
                            <i className={benefit.icon}></i>
                        </div>
                        <h3 style={{ marginBottom: '1rem', color: '#00274d' }}>{benefit.title}</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>{benefit.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlumniBenefits;
