import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Briefcase, Heart, Award, Building2, GraduationCap, Network, Mail, Phone, MapPin } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
    const [alumniCount, setAlumniCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [jobsCount, setJobsCount] = useState(0);

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

    const features = [
        {
            icon: <Network size={32} />,
            title: 'Alumni Network',
            description: 'Connect with thousands of alumni worldwide and build lasting professional relationships.',
            link: '/connect/alumni-directory',
            color: 'purple'
        },
        {
            icon: <Briefcase size={32} />,
            title: 'Career Hub',
            description: 'Explore job opportunities, mentorship programs, and career development resources.',
            link: '/career',
            color: 'blue'
        },
        {
            icon: <Calendar size={32} />,
            title: 'Events & Reunions',
            description: 'Join upcoming events, reunions, and networking opportunities with your batchmates.',
            link: '/events',
            color: 'purple'
        },
        {
            icon: <GraduationCap size={32} />,
            title: 'Alumni Benefits',
            description: 'Access exclusive benefits including library resources, career support, and more.',
            link: '/about/benefits',
            color: 'blue'
        },
        {
            icon: <Heart size={32} />,
            title: 'Give Back',
            description: 'Support scholarships, campus development, and initiatives that shape future generations.',
            link: '/connect/how-to-give',
            color: 'purple'
        },
        {
            icon: <Building2 size={32} />,
            title: 'Business Directory',
            description: 'Discover businesses owned by alumni and support fellow NSMOSA entrepreneurs.',
            link: '/connect/business-directory',
            color: 'blue'
        }
    ];

    const stats = [
        { icon: <Users size={40} />, number: `${alumniCount.toLocaleString()}+`, label: 'Active Alumni', color: 'purple' },
        { icon: <Calendar size={40} />, number: `${eventsCount}+`, label: 'Annual Events', color: 'blue' },
        { icon: <Briefcase size={40} />, number: `${jobsCount}+`, label: 'Job Opportunities', color: 'purple' },
        { icon: <Award size={40} />, number: '37+', label: 'Years of Excellence', color: 'blue' }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-pattern"></div>
                </div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">NSM Old Students Association</div>
                        <h1 className="hero-title">
                            Towards a Better Society
                        </h1>
                        <p className="hero-description">
                            Connecting alumni worldwide, fostering professional growth, and building a stronger community 
                            that continues to make a positive impact on society.
                        </p>
                        <div className="hero-actions">
                            <Link to="/connect/profile">
                                <button className="btn-primary">
                                    Join the Network
                                    <ArrowRight size={20} />
                                </button>
                            </Link>
                            <Link to="/about">
                                <button className="btn-secondary">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className={`stat-card stat-${stat.color}`}>
                                <div className="stat-icon-wrapper">
                                    {stat.icon}
                                </div>
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">About NSMOSA</h2>
                        <p className="section-subtitle">
                            N.St.Mathew's Public School has put up 37 years of glorious service in the field of education. 
                            The year 1973 saw the humble beginning of the school that was to make a name for itself.
                        </p>
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <h3>Our Mission</h3>
                            <p>
                                To strengthen the bond between alumni and our alma mater, foster professional networking, 
                                support career development, and contribute to the continued growth and excellence of NSM.
                            </p>
                            <h3>Our Vision</h3>
                            <p>
                                To create a vibrant, engaged alumni community that supports each other, gives back to the 
                                institution, and makes a meaningful impact on society.
                            </p>
                            <Link to="/about">
                                <button className="btn-outline">
                                    Explore More About Us
                                    <ArrowRight size={18} />
                                </button>
                            </Link>
                        </div>
                        <div className="about-image">
                            <div className="about-image-placeholder">
                                <GraduationCap size={80} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Explore Our Platform</h2>
                        <p className="section-subtitle">
                            Discover the many ways to connect, grow, and contribute to the NSMOSA community.
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <Link key={index} to={feature.link} className={`feature-card feature-${feature.color}`}>
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                <div className="feature-link">
                                    Learn More <ArrowRight size={16} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="quicklinks-section">
                <div className="container">
                    <div className="quicklinks-grid">
                        <Link to="/about/president" className="quicklink-card">
                            <div className="quicklink-icon">
                                <Award size={32} />
                            </div>
                            <h4>President's Message</h4>
                            <p>Read the message from our President</p>
                        </Link>
                        <Link to="/about/executive-committee" className="quicklink-card">
                            <div className="quicklink-icon">
                                <Users size={32} />
                            </div>
                            <h4>Executive Committee</h4>
                            <p>Meet our leadership team</p>
                        </Link>
                        <Link to="/gallery" className="quicklink-card">
                            <div className="quicklink-icon">
                                <Calendar size={32} />
                            </div>
                            <h4>Photo Gallery</h4>
                            <p>Browse our event photos</p>
                        </Link>
                        <Link to="/reunion" className="quicklink-card">
                            <div className="quicklink-icon">
                                <Heart size={32} />
                            </div>
                            <h4>Reunions</h4>
                            <p>Join upcoming reunions</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="contact-section">
                <div className="container">
                    <div className="contact-content">
                        <h2>Get in Touch</h2>
                        <p>Have questions or want to connect? We're here to help.</p>
                        <div className="contact-info">
                            <div className="contact-item">
                                <Mail size={24} />
                                <span>alumni@nsmschool.edu</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={24} />
                                <span>+91-90000 00000</span>
                            </div>
                            <div className="contact-item">
                                <MapPin size={24} />
                                <span>Vijayawada, Andhra Pradesh</span>
                            </div>
                        </div>
                        <Link to="/contact">
                            <button className="btn-primary">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
