import React from 'react';

const AlumniEvent: React.FC = () => {
    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>Alumni Event</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem' }}>
                Join our upcoming alumni events and reconnect with your batchmates and the NSMOSA community.
            </p>
            <div style={{ 
                background: '#fff', 
                padding: '2rem', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <p style={{ color: '#666', textAlign: 'center' }}>
                    Event information will be displayed here. Please check back soon for upcoming events.
                </p>
            </div>
        </div>
    );
};

export default AlumniEvent;
