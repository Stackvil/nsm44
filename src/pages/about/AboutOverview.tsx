import React from 'react';

const AboutOverview: React.FC = () => {
    return (
        <div className="container py-16">
            <div className="about-hero-quote" style={{ textAlign: 'center', marginBottom: '3rem', padding: '2rem', background: '#f8f9fa', borderRadius: '10px' }}>
                <div style={{ fontSize: '3rem', color: '#00274d', marginBottom: '1rem' }}>
                    <i className="fas fa-quote-left"></i>
                </div>
                <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: '#333', maxWidth: '800px', margin: '0 auto' }}>
                    "The future of India is shaped in her classrooms," Pandit Nehru was very true when he uttered these lines
                    because, certainly the future of many a great Indian is moulded in NSM.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: '2rem' }}>About NSMOSA</h1>

                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ fontSize: '3rem', color: '#00274d' }}>
                                <i className="fas fa-graduation-cap"></i>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#00274d' }}>37 Years of Glorious Service</h3>
                                <p style={{ lineHeight: '1.8', color: '#555' }}>
                                    N.St.Mathew's Public School has put up <strong>37 years of glorious service</strong> in the field of
                                    education. The year <strong>1973</strong>, saw the humble beginning of the school that was to make a
                                    name for itself.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ fontSize: '3rem', color: '#00274d' }}>
                                <i className="fas fa-road"></i>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#00274d' }}>A Journey of Excellence</h3>
                                <p style={{ lineHeight: '1.8', color: '#555' }}>
                                    The journey of a thousand miles begins with a single step. Similarly NSMOSA has risen from a humble
                                    dwelling to imposing buildings well equipped with latest state-of-art technology. The school is
                                    managed by the <strong>Society of Montfort Brothers of St. Gabriel</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '2.5rem', color: '#00274d', marginBottom: '1rem' }}>
                                <i className="fas fa-chalkboard-teacher"></i>
                            </div>
                            <h4 style={{ marginBottom: '0.5rem', color: '#00274d' }}>Classes</h4>
                            <p style={{ color: '#666' }}>KG to X</p>
                        </div>
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '2.5rem', color: '#00274d', marginBottom: '1rem' }}>
                                <i className="fas fa-certificate"></i>
                            </div>
                            <h4 style={{ marginBottom: '0.5rem', color: '#00274d' }}>Recognition</h4>
                            <p style={{ color: '#666' }}>CBSE, New Delhi</p>
                        </div>
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '2.5rem', color: '#00274d', marginBottom: '1rem' }}>
                                <i className="fas fa-users"></i>
                            </div>
                            <h4 style={{ marginBottom: '0.5rem', color: '#00274d' }}>Type</h4>
                            <p style={{ color: '#666' }}>Co-educational</p>
                        </div>
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '2.5rem', color: '#00274d', marginBottom: '1rem' }}>
                                <i className="fas fa-language"></i>
                            </div>
                            <h4 style={{ marginBottom: '0.5rem', color: '#00274d' }}>Medium</h4>
                            <p style={{ color: '#666' }}>English</p>
                        </div>
                    </div>

                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginBottom: '1rem', color: '#00274d' }}>
                            <i className="fas fa-phone-alt"></i> Contact NSMOSA
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <i className="fas fa-phone" style={{ color: '#00274d' }}></i>
                                <span>Phone: +91-90000 00000</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <i className="fas fa-envelope" style={{ color: '#00274d' }}></i>
                                <span>Email: alumni@nsmschool.edu</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <img 
                        src="/images/nsm outer photos/globe.jpg" 
                        alt="NSM Global Reach" 
                        style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutOverview;
