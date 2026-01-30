import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, Calendar, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import { DB, EventPhoto } from '../db';

type ViewMode = 'CATEGORIES' | 'EVENTS_LIST' | 'EVENT_PHOTOS';
type CategoryType = 'social' | 'nsmosa';

// System defaults to match legacy behavior
const SYSTEM_DEFAULTS: EventPhoto[] = [
    {
        id: 'social-2024-default',
        eventName: 'Annual General Body Meeting',
        category: 'social',
        year: 2024,
        photos: Array(15).fill({ url: '/images/social-events/Gen%20Sec%20report%20PPT%202024-25-1.jpg', name: 'Slide 1' }),
        eventDate: '2024-01-01',
        createdAt: 0
    },
    {
        id: 'nsmosa-jubilee-default',
        eventName: 'Golden Jubilee Celebrations',
        category: 'nsmosa',
        year: 2023,
        photos: Array(60).fill({ url: '/images/golden%20jublee%20celebrations/golden%20jublee%20celebrations/Gen%20Sec%20report%202023-24-1.jpg', name: 'Jubilee 1' }),
        eventDate: '2023-01-01',
        createdAt: 0
    }
];

const Events: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('CATEGORIES');
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventPhoto | null>(null);
    const [events, setEvents] = useState<EventPhoto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Fetch events when category changes
    useEffect(() => {
        if (viewMode === 'EVENTS_LIST' && selectedCategory) {
            loadEvents(selectedCategory);
        }
    }, [viewMode, selectedCategory]);

    const loadEvents = async (category: CategoryType) => {
        setLoading(true);
        try {
            const dbEvents = await DB.getEvents();

            // Filter system defaults relevant to this category that aren't already in DB
            const defaults = SYSTEM_DEFAULTS.filter(
                d => d.category === category && !dbEvents.some(e => e.id === d.id)
            );

            // Combine DB events and defaults
            const categoryEvents = [
                ...dbEvents.filter(e => e.category === category),
                ...defaults
            ];

            // Sort by year descending
            categoryEvents.sort((a, b) => b.year - a.year);

            setEvents(categoryEvents);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (category: CategoryType) => {
        setSelectedCategory(category);
        setViewMode('EVENTS_LIST');
    };

    const handleEventSelect = (event: EventPhoto) => {
        setSelectedEvent(event);
        setViewMode('EVENT_PHOTOS');
    };

    const handleBack = () => {
        if (viewMode === 'EVENT_PHOTOS') {
            setViewMode('EVENTS_LIST');
            setSelectedEvent(null);
        } else if (viewMode === 'EVENTS_LIST') {
            setViewMode('CATEGORIES');
            setSelectedCategory(null);
            setEvents([]);
        }
    };

    // --- STYLES ---
    const styles = {
        container: {
            // minHeight removed to let content dictate height
            padding: '1rem 0', // Reduced to minimal vertical padding
            backgroundColor: '#f9fafb',
            fontFamily: "'Roboto', sans-serif"
        },
        innerContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem' // Add side padding to inner container instead
        },
        header: {
            textAlign: 'center' as const,
            marginBottom: '1rem' // Reduced further
        },
        title: {
            fontSize: '2rem', // Slightly smaller title
            fontWeight: 'bold',
            color: '#1a237e',
            marginBottom: '0.25rem'
        },
        subtitle: {
            color: '#4b5563',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.5',
            fontSize: '0.9rem'
        },
        gridContainer: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            justifyContent: 'center',
            gap: '1.5rem', // Reduced gap
            marginTop: '1rem'
        },
        card: {
            width: '100%',
            maxWidth: '380px', // Slightly smaller max-width
            borderRadius: '16px',
            padding: '1.5rem', // Reduced padding inside card
            textAlign: 'center' as const,
            position: 'relative' as const,
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            minHeight: '220px', // Reduced height
            justifyContent: 'center'
        },
        cardIconBg: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
        },
        cardTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
        },
        cardLink: {
            fontSize: '0.9rem',
            opacity: 0.9,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        backBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#1a237e',
            fontWeight: 600,
            marginBottom: '2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
        },
        listGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
        },
        eventCard: {
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
        },
        eventImgContainer: {
            position: 'relative' as const,
            width: '100%',
            paddingTop: '75%', // 4:3 Aspect Ratio
            backgroundColor: '#e5e7eb'
        },
        eventImg: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover' as const
        },
        eventOverlay: {
            position: 'absolute' as const,
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            padding: '1.5rem',
            color: 'white'
        },
        photoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
        },
        photoItem: {
            aspectRatio: '1',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#e5e7eb',
            cursor: 'zoom-in'
        }
    };

    // --- RENDERERS ---

    const renderCategories = () => (
        <div style={styles.gridContainer}>
            {/* Social Events Card */}
            <motion.div
                whileHover={{ y: -8, boxShadow: '0 12px 32px rgba(0,78,146,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategorySelect('social')}
                style={{
                    ...styles.card,
                    background: 'linear-gradient(135deg, #004e92 0%, #00274d 100%)'
                }}
            >
                <div style={styles.cardIconBg}>
                    <Users color="white" size={40} />
                </div>
                <h3 style={styles.cardTitle}>Social Events</h3>
                <p style={styles.cardLink}>
                    View Gallery <span>→</span>
                </p>
            </motion.div>

            {/* NSMOSA Events Card */}
            <motion.div
                whileHover={{ y: -8, boxShadow: '0 12px 32px rgba(251,191,36,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategorySelect('nsmosa')}
                style={{
                    ...styles.card,
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                }}
            >
                <div style={styles.cardIconBg}>
                    <Star color="white" size={40} />
                </div>
                <h3 style={styles.cardTitle}>NSMOSA Events</h3>
                <p style={styles.cardLink}>
                    View Gallery <span>→</span>
                </p>
            </motion.div>
        </div>
    );

    const renderEventsList = () => (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <button onClick={handleBack} style={styles.backBtn}>
                    <ArrowLeft size={20} />
                    Back to Categories
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {selectedCategory === 'social' ? 'Social Events' : 'NSMOSA Events'}
                </h2>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 className="animate-spin text-loyola-blue" size={32} />
                </div>
            ) : events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
                    <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No events found in this category.</p>
                </div>
            ) : (
                <div style={styles.listGrid}>
                    {events.map((event) => {
                        const coverImage = event.photos.length > 0 ? event.photos[0].url : '';

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                onClick={() => handleEventSelect(event)}
                                style={styles.eventCard}
                            >
                                <div style={styles.eventImgContainer}>
                                    {coverImage ? (
                                        <img
                                            src={coverImage}
                                            alt={event.eventName}
                                            style={styles.eventImg}
                                        />
                                    ) : (
                                        <div style={{ ...styles.eventImg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                    <div style={styles.eventOverlay}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.9 }}>{event.year}</span>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.25rem 0' }}>{event.eventName}</h3>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>{event.photos.length} Photos</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    const renderEventPhotos = () => {
        if (!selectedEvent) return null;

        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <button onClick={handleBack} style={styles.backBtn}>
                        <ArrowLeft size={20} />
                        Back to Events
                    </button>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{selectedEvent.eventName}</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{selectedEvent.year} • {selectedEvent.photos.length} Photos</p>
                    </div>
                </div>

                <div style={styles.photoGrid}>
                    {selectedEvent.photos.length > 0 ? (
                        selectedEvent.photos.map((photo, idx) => (
                            <motion.div
                                key={`${photo.id}-${idx}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                style={styles.photoItem}
                                onClick={() => setSelectedImage(photo.url)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.name || `Photo ${idx + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    loading="lazy"
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                            No photos available for this event.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.innerContainer}>
                <div style={styles.header}>
                    <h1 style={styles.title}>NSMOSA Alumni Events</h1>
                    <p style={styles.subtitle}>
                        Join us in celebrating our shared history and building future connections.
                        Browse through our social gatherings and official NSMOSA events.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewMode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {viewMode === 'CATEGORIES' && renderCategories()}
                        {viewMode === 'EVENTS_LIST' && renderEventsList()}
                        {viewMode === 'EVENT_PHOTOS' && renderEventPhotos()}
                    </motion.div>
                </AnimatePresence>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 1000,
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1rem',
                                cursor: 'zoom-out',
                                backdropFilter: 'blur(4px)'
                            }}
                        >
                            <motion.img
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                src={selectedImage}
                                alt="Full size"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '90vh',
                                    objectFit: 'contain',
                                    borderRadius: '4px',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                }}
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    color: 'white',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Events;
