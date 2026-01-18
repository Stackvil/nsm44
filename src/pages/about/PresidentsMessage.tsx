import React from 'react';

const PresidentsMessage: React.FC = () => {
    return (
        <div className="container py-16">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: '2rem' }}>President's Message</h1>
                    <div style={{ lineHeight: '1.8', color: '#555' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            It gives me immense pride and pleasure to welcome you to the official website of NSM Old Students Association (NSM OSA).
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            NSM OSA is more than an alumni platform. It is a living bond that connects generations of students through shared values, memories, and a commitment to growth. Our association strives to strengthen these connections by fostering meaningful engagement, collaboration, and mutual support among alumni, students, and the institution.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Over the years, NSM OSA has grown into a vibrant community that actively contributes to academic excellence, professional development, social responsibility, and the overall progress of our alma mater. This journey has been possible because of the collective efforts, dedication, and goodwill of our members.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            This website serves as a digital bridge. A place to reconnect, stay informed about upcoming events and initiatives, celebrate achievements, and participate in shaping the future of NSM OSA. I encourage all alumni to stay engaged, contribute their ideas, and be active partners in our shared mission.
                        </p>
                        <p style={{ marginBottom: '2rem' }}>
                            Together, let us continue to uphold the legacy of NSM and inspire future generations with unity, integrity, and purpose.
                        </p>
                        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #e0e0e0' }}>
                            <p style={{ marginBottom: '0.5rem' }}>Warm Regards,</p>
                            <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#00274d' }}>
                                Nalluri Venkat Jagdish
                            </p>
                            <p style={{ color: '#666' }}>President NSM OSA</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <img 
                            src="/images/presedent.jpeg" 
                            alt="Nalluri Venkat Jagdish - President NSM OSA"
                            style={{ width: '100%', display: 'block' }}
                        />
                        <div style={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            background: 'linear-gradient(to top, rgba(0,39,77,0.9), transparent)',
                            padding: '2rem',
                            color: 'white'
                        }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Nalluri Venkat Jagdish</h3>
                            <p style={{ marginBottom: '0.25rem' }}>President</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>NSM OSA</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PresidentsMessage;
