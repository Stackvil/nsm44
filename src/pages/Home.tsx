import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Briefcase, Heart, TrendingUp, Award } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../api';
import './Home.css';

const Home: React.FC = () => {
    const [alumniCount, setAlumniCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [jobsCount, setJobsCount] = useState(0);
    const [pageContent, setPageContent] = useState<any>({});
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/content/home');
                let data = res.data.content;
                if (typeof data === 'string') {
                    try { data = JSON.parse(data); } catch (e) { }
                }
                setPageContent(data || {});
            } catch (err) {
                console.log('Using default content');
            }
        }
        fetchContent();
    }, []);

    // Alumni Spotlight Data
    const spotlightAlumni = [
        {
            name: 'Dr. Sarah Johnson',
            batch: 'Class of 2010',
            title: 'Chief Technology Officer',
            company: 'TechCorp Global',
            image: '/images/alumni-1.jpg',
            quote: 'NSM gave me the foundation to dream big and achieve bigger.',
        },
        {
            name: 'Michael Chen',
            batch: 'Class of 2015',
            title: 'Entrepreneur & Founder',
            company: 'InnovateLabs',
            image: '/images/alumni-2.jpg',
            quote: 'The network I built here opened doors I never imagined.',
        },
        {
            name: 'Prof. Aisha Patel',
            batch: 'Class of 2008',
            title: 'Research Scientist',
            company: 'MIT',
            image: '/images/alumni-3.jpg',
            quote: 'Excellence is not just taught here, it\'s lived.',
        },
    ];

    // Upcoming Events
    const upcomingEvents = [
        {
            title: 'Annual Alumni Reunion 2026',
            date: 'March 15, 2026',
            location: 'Main Campus',
            type: 'In-Person',
        },
        {
            title: 'Virtual Career Fair',
            date: 'February 20, 2026',
            location: 'Online',
            type: 'Virtual',
        },
        {
            title: 'Batch of 2000 Silver Jubilee',
            date: 'April 10, 2026',
            location: 'Grand Hall',
            type: 'In-Person',
        },
    ];

    // Auto-rotate carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % spotlightAlumni.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Animated counters
    useEffect(() => {
        const animateCounter = (target: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setter(target);
                    clearInterval(timer);
                } else {
                    setter(Math.floor(current));
                }
            }, 30);
        };

        animateCounter(50000, setAlumniCount);
        animateCounter(250, setEventsCount);
        animateCounter(1200, setJobsCount);
    }, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title fade-in">
                            {pageContent.heroTitle || "Welcome to Your Lifelong Community"}
                        </h1>
                        <p className="hero-subtitle slide-up">
                            {pageContent.heroSubtitle || "Connect with fellow alumni, advance your career, and give back to the institution that shaped your future."}
                        </p>
                        <div className="hero-actions">
                            <Link to="/directory">
                                <Button variant="primary" size="lg">
                                    Reconnect with Your Batch
                                    <ArrowRight size={20} />
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" size="lg">
                                    Join the Network
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <Users className="stat-icon" size={40} />
                            <div className="stat-number">{alumniCount.toLocaleString()}+</div>
                            <div className="stat-label">Alumni Connected</div>
                        </div>
                        <div className="stat-item">
                            <Calendar className="stat-icon" size={40} />
                            <div className="stat-number">{eventsCount}+</div>
                            <div className="stat-label">Events Annually</div>
                        </div>
                        <div className="stat-item">
                            <Briefcase className="stat-icon" size={40} />
                            <div className="stat-number">{jobsCount}+</div>
                            <div className="stat-label">Career Opportunities</div>
                        </div>
                        <div className="stat-item">
                            <Heart className="stat-icon" size={40} />
                            <div className="stat-number">$2.5M+</div>
                            <div className="stat-label">Donated This Year</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alumni Spotlight Carousel */}
            <section className="spotlight">
                <div className="container">
                    <h2 className="text-center">Alumni Spotlight</h2>
                    <p className="text-center text-secondary mb-12">
                        Celebrating the achievements of our distinguished alumni
                    </p>

                    <div className="spotlight-carousel">
                        {spotlightAlumni.map((alumni, index) => (
                            <div
                                key={index}
                                className={`spotlight-slide ${index === currentSlide ? 'active' : ''}`}
                            >
                                <Card className="spotlight-card">
                                    <div className="spotlight-content">
                                        <div className="spotlight-image-wrapper">
                                            <div className="spotlight-image-placeholder">
                                                <Award size={80} />
                                            </div>
                                        </div>
                                        <div className="spotlight-info">
                                            <h3>{alumni.name}</h3>
                                            <p className="spotlight-batch">{alumni.batch}</p>
                                            <p className="spotlight-title">{alumni.title}</p>
                                            <p className="spotlight-company">{alumni.company}</p>
                                            <blockquote className="spotlight-quote">
                                                "{alumni.quote}"
                                            </blockquote>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}

                        <div className="spotlight-indicators">
                            {spotlightAlumni.map((_, index) => (
                                <button
                                    key={index}
                                    className={`spotlight-indicator ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Ticker */}
            <section className="events-ticker">
                <div className="container">
                    <h2 className="text-center">Upcoming Reunions & Events</h2>
                    <div className="events-grid">
                        {upcomingEvents.map((event, index) => (
                            <Card key={index} hover className="event-card">
                                <div className="event-type-badge">{event.type}</div>
                                <h4>{event.title}</h4>
                                <p className="event-date">
                                    <Calendar size={16} />
                                    {event.date}
                                </p>
                                <p className="event-location">{event.location}</p>
                                <Link to="/events">
                                    <Button variant="ghost" size="sm">
                                        Learn More
                                        <ArrowRight size={16} />
                                    </Button>
                                </Link>
                            </Card>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link to="/events">
                            <Button variant="outline" size="lg">
                                View All Events
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Access Section */}
            <section className="quick-access">
                <div className="container">
                    <h2 className="text-center">Explore Your Alumni Hub</h2>
                    <div className="quick-access-grid">
                        <Card hover className="access-card">
                            <Briefcase className="access-icon" size={48} />
                            <h3>Career Hub</h3>
                            <p>Find job opportunities and connect with mentors</p>
                            <Link to="/career">
                                <Button variant="primary">
                                    Explore Jobs
                                    <ArrowRight size={16} />
                                </Button>
                            </Link>
                        </Card>

                        <Card hover className="access-card">
                            <Heart className="access-icon" size={48} />
                            <h3>Give Back</h3>
                            <p>Support scholarships and campus development</p>
                            <Link to="/giving">
                                <Button variant="primary">
                                    Make an Impact
                                    <ArrowRight size={16} />
                                </Button>
                            </Link>
                        </Card>

                        <Card hover className="access-card">
                            <TrendingUp className="access-icon" size={48} />
                            <h3>Memento Store</h3>
                            <p>Shop exclusive institution-branded merchandise</p>
                            <Link to="/store">
                                <Button variant="primary">
                                    Shop Now
                                    <ArrowRight size={16} />
                                </Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Reconnect?</h2>
                        <p>Join thousands of alumni building meaningful connections</p>
                        <div className="cta-actions">
                            <Link to="/register">
                                <Button variant="primary" size="lg">
                                    Join the Network
                                </Button>
                            </Link>
                            <Link to="/directory">
                                <Button variant="outline" size="lg">
                                    Browse Directory
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
