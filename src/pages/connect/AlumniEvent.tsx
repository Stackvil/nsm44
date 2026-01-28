import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DB, EventPhoto } from '../../db';

const AlumniEvent: React.FC = () => {
    const [socialEvents, setSocialEvents] = useState<EventPhoto[]>([]);
    const [nsmosaEvents, setNsmosaEvents] = useState<EventPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<EventPhoto | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = () => {
            const role = sessionStorage.getItem('nsm_user_role');
            const isAdmin = ['admin', 'super-admin', 'representative'].includes(role || '');
            const loggedIn = sessionStorage.getItem('nsm_user_logged_in') === 'true' ||
                sessionStorage.getItem('nsm_is_logged_in') === 'true' ||
                (window as any).isUserLoggedIn === true ||
                isAdmin;
            setIsLoggedIn(loggedIn);
        };
        checkLogin();
        const interval = setInterval(checkLogin, 1000);

        loadEvents();
        return () => clearInterval(interval);
    }, []);

    const loadEvents = async () => {
        try {
            const allEvents = await DB.getEvents();
            setSocialEvents(allEvents.filter(e => e.category === 'social').sort((a, b) => b.year - a.year));
            setNsmosaEvents(allEvents.filter(e => e.category === 'nsmosa').sort((a, b) => b.year - a.year));
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const EventCard = ({ event }: { event: EventPhoto }) => (
        <div
            onClick={() => setSelectedEvent(event)}
            style={{
                background: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid #eee'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
            }}
        >
            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#f8fafc' }}>
                {event.photos.length > 0 ? (
                    <img
                        src={event.photos[0].url}
                        alt={event.eventName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-image" style={{ color: '#cbd5e1', fontSize: '48px' }}></i>
                    </div>
                )}
            </div>
            <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#00274d', fontSize: '1.25rem', fontWeight: '700' }}>
                    {event.eventName}
                </h3>
                <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>
                    <span><i className="fas fa-calendar"></i> {event.year}</span>
                    <span><i className="fas fa-images"></i> {event.photos.length} Photos</span>
                </div>
                <div style={{ color: '#004e92', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    View Gallery <i className="fas fa-arrow-right"></i>
                </div>
            </div>
        </div>
    );

    const EventSection = ({ title, events, color }: { title: string; events: EventPhoto[]; color: string }) => (
        <div style={{ marginBottom: '50px' }}>
            <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#00274d',
                marginBottom: '10px',
                paddingBottom: '15px',
                borderBottom: `3px solid ${color}`
            }}>
                {title}
            </h2>
            {events.length === 0 ? (
                <div style={{
                    background: '#f8fafc',
                    padding: '40px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: '#64748b'
                }}>
                    <i className="fas fa-calendar-alt" style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.5 }}></i>
                    <p>No events available in this category yet.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '25px',
                    marginTop: '25px'
                }}>
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );

    if (!isLoggedIn) {
        return (
            <div className="container py-16">
                <div style={{
                    background: '#fff',
                    borderRadius: '15px',
                    padding: '60px 40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00274d, #004080)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: '36px',
                        color: '#fff'
                    }}>
                        <i className="fas fa-lock"></i>
                    </div>
                    <h4 style={{ fontSize: '24px', fontWeight: '600', color: '#00274d', marginBottom: '1rem' }}>
                        Login Required
                    </h4>
                    <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Please login to view Alumni Events.
                    </p>
                    <Link to="/login">
                        <button style={{
                            padding: '14px 40px',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: '#00274d',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            margin: '0 auto'
                        }}>
                            <i className="fas fa-sign-in-alt"></i> Sign In to Access
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-16">
            <h1 className="page-title" style={{ marginBottom: '1rem' }}>Alumni Events</h1>
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem', maxWidth: '800px' }}>
                Join our upcoming alumni events and reconnect with your batchmates and the NSMOSA community.
                Browse through our collection of social events and NSMOSA special occasions.
            </p>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    <i className="fas fa-spinner fa-spin fa-3x" style={{ marginBottom: '20px' }}></i>
                    <p>Loading events...</p>
                </div>
            ) : (
                <>
                    <EventSection title="Social Events" events={socialEvents} color="#004e92" />
                    <EventSection title="NSMOSA Events" events={nsmosaEvents} color="#fbbf24" />
                </>
            )}

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div
                    onClick={() => setSelectedEvent(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        padding: '20px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#fff',
                            borderRadius: '16px',
                            maxWidth: '900px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            padding: '25px',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'sticky',
                            top: 0,
                            background: '#fff',
                            zIndex: 1
                        }}>
                            <div>
                                <h2 style={{ margin: 0, color: '#00274d' }}>{selectedEvent.eventName}</h2>
                                <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>
                                    {selectedEvent.year} • {selectedEvent.photos.length} Photos
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '28px',
                                    cursor: 'pointer',
                                    color: '#64748b',
                                    padding: '5px 10px'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{
                            padding: '25px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '15px'
                        }}>
                            {selectedEvent.photos.map((photo, index) => (
                                <div key={photo.id} style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: '8px' }}>
                                    <img
                                        src={photo.url}
                                        alt={photo.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => {
                                            // Open lightbox
                                            (window as any).openPhotoLightbox(
                                                selectedEvent.photos.map(p => p.url),
                                                index
                                            );
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlumniEvent;
