import React from 'react';

const AlumniChapters: React.FC = () => {
    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>Alumni Chapters</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem' }}>
                Connect with NSMOSA alumni chapters around the world. Our chapters organize events, networking opportunities, and support initiatives.
            </p>
            <div style={{ 
                background: '#fff', 
                padding: '2rem', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <p style={{ color: '#666', textAlign: 'center' }}>
                    Chapter information will be displayed here. Please check back soon for updates.
                </p>
            </div>
        </div>
    );
};

export default AlumniChapters;
