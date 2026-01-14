import React from 'react';
import { Link } from 'react-router-dom';

const PageManager: React.FC = () => {
    // List of manageable pages
    const pages = [
        { name: 'Home Page', slug: 'home', description: 'Hero section, Events, Gallery' },
        { name: 'About Page', slug: 'about', description: 'Overview, President Message, Committee' },
        { name: 'Reunion Page', slug: 'reunion', description: 'Reunion details and gallery' },
        { name: 'Events Page', slug: 'events', description: 'Upcoming and past events' },
    ];

    return (
        <div className="admin-page-section active">
            <div className="dashboard-grid">
                {/* Content Management Card */}
                <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header">
                        <div className="card-icon">
                            <i className="fas fa-edit"></i>
                        </div>
                        <h2>Content Management</h2>
                    </div>

                    <div className="items-list">
                        <div className="grid gap-4">
                            {pages.map((page) => (
                                <div key={page.slug} className="item-card">
                                    <div className="item-card-info">
                                        <h3>{page.name}</h3>
                                        <p>{page.description}</p>
                                    </div>
                                    <div className="item-card-actions">
                                        <Link to={`/admin/page/${page.slug}`}>
                                            <button className="btn btn-primary btn-small">
                                                <i className="fas fa-pen"></i> Edit Content
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional Stats/Info can go here */}
            </div>
        </div>
    );
};

export default PageManager;
