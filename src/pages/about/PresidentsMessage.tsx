import React from 'react';

const PresidentsMessage: React.FC = () => {
    return (
        <div className="container py-16">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: '2rem' }}>President's Message</h1>
                    <div style={{ lineHeight: '1.8', color: '#555' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#00274d' }}>
                            Dear NSMOSA Alumni Family,
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            I consider it as a great honour to address you from this renowned seat of learning, N. St. Mathew's
                            Public School, Vijayawada.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            This abode of learning stands tall in this city of Vijayawada, because of the vision of its founders,
                            the dedication of the teachers, excellence of students and the cooperation of the parents community.
                            It has been built on strong value system that passes from generation to generation.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            As we move ahead, we are striving to evolve into an ultra modern centre of education, following the
                            ever changing contours of pedagogy. We are able to challenge ourselves in order to bring out the best
                            in the students. The campus is serene, green and this adds to our belief perfectly calm and we believe
                            that we are able to groom the young scholars.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Children are born with an urge to succeed. They only need a good environment to grow and should be
                            sufficiently motivated to use every single opportunity that comes their way. In this endeavour, I,
                            with pride, mention the role of our diligent and committed faculty, who are endowed with boundless
                            energy. In order to bring out the unexplored potential of the students, we need constant encouragement
                            and support from the parents' community.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            We leave no stone unturned to empower the children with the necessary knowledge and skills that stand
                            them in good stead in their future. However, we also realise that every child comes with unique
                            qualities and capabilities. Hence, adequate care is taken to groom each of them to be a competent and
                            complete individual. We believe that imparting education is a shared commitment between dedicated
                            teachers, motivated students and enthusiastic parents.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Right from its inception in the year 1974, this mighty institution has been on quest for excellence in
                            curricular, co-curricular and extra-curricular pursuits and is strongly moving ahead with an aim of
                            shaping the young NSMites 'Towards a Better World'.
                        </p>
                        <p style={{ marginBottom: '2rem' }}>
                            As we gear up to march into the Golden Era of NSMOSA, I urge you to join us in this remarkable academic
                            mission that will shape the future of the students and make them ready to face the challenges that the
                            world will pose for them in their future.
                        </p>
                        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #e0e0e0' }}>
                            <p style={{ marginBottom: '0.5rem' }}>Warm regards,</p>
                            <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#00274d' }}>
                                Dr. Rajesh Kumar
                            </p>
                            <p style={{ color: '#666' }}>President, NSM Old Students Association</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <img 
                            src="/images/presedent.jpeg" 
                            alt="Dr. Rajesh Kumar - President, NSM Old Students Association"
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
                            <h3 style={{ marginBottom: '0.5rem' }}>Dr. Rajesh Kumar</h3>
                            <p style={{ marginBottom: '0.25rem' }}>President</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>NSM Old Students Association</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PresidentsMessage;
