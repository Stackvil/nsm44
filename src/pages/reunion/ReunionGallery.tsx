import React from 'react';

const ReunionGallery: React.FC = () => {
    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>Photo Gallery Reunion</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem' }}>
                Browse photos from past NSMOSA reunions and relive the memories.
            </p>
            <div style={{ 
                background: '#fff', 
                padding: '2rem', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <p style={{ color: '#666', textAlign: 'center' }}>
                    Reunion photo gallery will be displayed here. Content migrated from index.html.
                </p>
            </div>
        </div>
    );
};

export default ReunionGallery;
