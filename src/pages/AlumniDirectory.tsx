import React, { useState } from 'react';
import { Search, Filter, Grid, List, MapPin, Briefcase, GraduationCap, Mail } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import './AlumniDirectory.css';

interface Alumni {
    id: number;
    name: string;
    batch: string;
    degree: string;
    industry: string;
    location: string;
    company: string;
    position: string;
    email: string;
    skills: string[];
}

const AlumniDirectory: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showFilters, setShowFilters] = useState(true);

    // Mock alumni data
    const alumniData: Alumni[] = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            batch: '2010',
            degree: 'Computer Science',
            industry: 'Technology',
            location: 'San Francisco, CA',
            company: 'TechCorp Global',
            position: 'Chief Technology Officer',
            email: 'sarah.j@example.com',
            skills: ['AI', 'Machine Learning', 'Leadership'],
        },
        {
            id: 2,
            name: 'Michael Chen',
            batch: '2015',
            degree: 'Business Administration',
            industry: 'Entrepreneurship',
            location: 'New York, NY',
            company: 'InnovateLabs',
            position: 'Founder & CEO',
            email: 'michael.c@example.com',
            skills: ['Strategy', 'Innovation', 'Venture Capital'],
        },
        {
            id: 3,
            name: 'Prof. Aisha Patel',
            batch: '2008',
            degree: 'Physics',
            industry: 'Academia',
            location: 'Boston, MA',
            company: 'MIT',
            position: 'Research Scientist',
            email: 'aisha.p@example.com',
            skills: ['Research', 'Quantum Physics', 'Teaching'],
        },
        {
            id: 4,
            name: 'James Rodriguez',
            batch: '2012',
            degree: 'Mechanical Engineering',
            industry: 'Automotive',
            location: 'Detroit, MI',
            company: 'AutoTech Inc',
            position: 'Senior Engineer',
            email: 'james.r@example.com',
            skills: ['CAD', 'Manufacturing', 'Design'],
        },
        {
            id: 5,
            name: 'Emily Watson',
            batch: '2018',
            degree: 'Marketing',
            industry: 'Digital Marketing',
            location: 'Los Angeles, CA',
            company: 'CreativeHub',
            position: 'Marketing Director',
            email: 'emily.w@example.com',
            skills: ['SEO', 'Content Strategy', 'Analytics'],
        },
        {
            id: 6,
            name: 'Raj Kumar',
            batch: '2005',
            degree: 'Finance',
            industry: 'Banking',
            location: 'London, UK',
            company: 'Global Bank',
            position: 'VP of Finance',
            email: 'raj.k@example.com',
            skills: ['Investment', 'Risk Management', 'Strategy'],
        },
    ];

    // Filter options
    const batches = ['2005', '2008', '2010', '2012', '2015', '2018', '2020', '2022'];
    const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Entrepreneurship', 'Academia', 'Automotive', 'Digital Marketing'];
    const locations = ['San Francisco, CA', 'New York, NY', 'Boston, MA', 'Detroit, MI', 'Los Angeles, CA', 'London, UK', 'Singapore', 'Mumbai, India'];

    // Filter alumni based on search and filters
    const filteredAlumni = alumniData.filter((alumni) => {
        const matchesSearch = alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumni.position.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBatch = !selectedBatch || alumni.batch === selectedBatch;
        const matchesIndustry = !selectedIndustry || alumni.industry === selectedIndustry;
        const matchesLocation = !selectedLocation || alumni.location === selectedLocation;

        return matchesSearch && matchesBatch && matchesIndustry && matchesLocation;
    });

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedBatch('');
        setSelectedIndustry('');
        setSelectedLocation('');
    };

    return (
        <div className="alumni-directory">
            {/* Header */}
            <section className="directory-header">
                <div className="container">
                    <h1>Alumni Directory</h1>
                    <p>Connect with {alumniData.length.toLocaleString()}+ alumni worldwide</p>
                </div>
            </section>

            <div className="container">
                <div className="directory-layout">
                    {/* Filters Sidebar */}
                    <aside className={`directory-filters ${showFilters ? 'show' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                Clear All
                            </Button>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Search</label>
                            <Input
                                type="text"
                                placeholder="Search by name, company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Batch Year</label>
                            <select
                                className="filter-select"
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                            >
                                <option value="">All Batches</option>
                                {batches.map((batch) => (
                                    <option key={batch} value={batch}>
                                        Class of {batch}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Industry</label>
                            <select
                                className="filter-select"
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                            >
                                <option value="">All Industries</option>
                                {industries.map((industry) => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Location</label>
                            <select
                                className="filter-select"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {locations.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="directory-content">
                        {/* Toolbar */}
                        <div className="directory-toolbar">
                            <div className="toolbar-left">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="filter-toggle"
                                >
                                    <Filter size={18} />
                                    {showFilters ? 'Hide' : 'Show'} Filters
                                </Button>
                                <span className="results-count">
                                    {filteredAlumni.length} alumni found
                                </span>
                            </div>

                            <div className="toolbar-right">
                                <div className="view-toggle">
                                    <button
                                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                        aria-label="Grid view"
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                        onClick={() => setViewMode('list')}
                                        aria-label="List view"
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Alumni Grid/List */}
                        <div className={`alumni-${viewMode}`}>
                            {filteredAlumni.length === 0 ? (
                                <div className="no-results">
                                    <Search size={48} />
                                    <h3>No alumni found</h3>
                                    <p>Try adjusting your filters or search query</p>
                                    <Button variant="outline" onClick={clearFilters}>
                                        Clear Filters
                                    </Button>
                                </div>
                            ) : (
                                filteredAlumni.map((alumni) => (
                                    <Card key={alumni.id} hover className="alumni-card">
                                        <div className="alumni-avatar">
                                            <GraduationCap size={32} />
                                        </div>
                                        <div className="alumni-info">
                                            <h3>{alumni.name}</h3>
                                            <p className="alumni-batch">Class of {alumni.batch}</p>
                                            <div className="alumni-details">
                                                <div className="detail-item">
                                                    <Briefcase size={14} />
                                                    <span>{alumni.position} at {alumni.company}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <MapPin size={14} />
                                                    <span>{alumni.location}</span>
                                                </div>
                                            </div>
                                            <div className="alumni-skills">
                                                {alumni.skills.slice(0, 3).map((skill, index) => (
                                                    <span key={index} className="skill-tag">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="alumni-actions">
                                            <Button variant="primary" size="sm">
                                                <Mail size={16} />
                                                Connect
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AlumniDirectory;
