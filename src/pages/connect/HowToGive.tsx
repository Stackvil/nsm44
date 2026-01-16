import React from 'react';

const HowToGive: React.FC = () => {
    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>How to Give</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem' }}>
                Support NSMOSA through donations, sponsorships, or volunteering your time and expertise.
            </p>
            <div style={{ 
                background: '#fff', 
                padding: '2rem', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <p style={{ color: '#666', textAlign: 'center' }}>
                    Information about giving will be displayed here. Content migrated from index.html.
                </p>
            </div>
        </div>
    );
};

export default HowToGive;
