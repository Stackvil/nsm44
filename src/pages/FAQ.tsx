import React from 'react';

const FAQ: React.FC = () => {
    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>FAQ's</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem' }}>
                Frequently asked questions about NSMOSA and the alumni association.
            </p>
            <div style={{ 
                background: '#fff', 
                padding: '2rem', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <p style={{ color: '#666', textAlign: 'center' }}>
                    FAQ content will be displayed here. Content migrated from index.html.
                </p>
            </div>
        </div>
    );
};

export default FAQ;
