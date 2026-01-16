import React from 'react';

const ExecutiveCommittee: React.FC = () => {
    const committeeData = {
        organization: "NSM Alumni",
        body: "Governing Council",
        title: "Office Bearer's",
        term: "2024-27",
        team: [
            {
                name: "Venkat Jagdish Nalluri",
                designation: "President",
                email: "vjnots@gmail.com",
                professional_title: "Managing Director",
                organization: "OTS Advertisings"
            },
            {
                name: "Gurjeet Singh Sahni",
                designation: "General Secretary",
                email: "vjwgurjeet@gmail.com",
                professional_title: "Managing Director",
                organization: "Sahni Auto Pvt Ltd",
                additional_info: "Dealers for Tata Commercial Vehicles"
            },
            {
                name: "Jayanarayana Kureti",
                designation: "Sr. Vice President",
                email: "jaykureti@gmail.com",
                professional_title: "Founder & CEO",
                organization: "Jaan Entertainment Pvt Ltd",
                additional_info: "ETHREE: Rajiv Gandhi Park"
            },
            {
                name: "Aeesha Khatoon",
                designation: "Sr. Secretary",
                email: "aeeshakhatoon10@gmail.com",
                professional_title: "Optometrist",
                organization: "Dilip Opticals"
            },
            {
                name: "Jaideep Arza",
                designation: "Jr. Vice President",
                email: "ajaideep@gmail.com",
                professional_title: "Proprietor",
                organization: "Sri Dhanalakshmi Stones & Tiles"
            },
            {
                name: "Kowtha.V.Subba Rao",
                designation: "Treasurer",
                email: "kowtha1@hotmail.com",
                professional_title: "Chartered Accountant",
                organization: "M/s Kowtha & Co.",
                additional_info: "Partner"
            },
            {
                name: "Suhrith Durbha",
                designation: "Jr. Secretary",
                email: "suhrith.raja@gmail.com",
                professional_title: "Business Associate",
                organization: "Bank of Baroda"
            }
        ]
    };

    const getBadgeClass = (designation: string) => {
        if (designation.toLowerCase().includes('president')) {
            return '#ff6b35'; // Orange for President
        } else if (designation.toLowerCase().includes('vice president')) {
            return '#00274d'; // Dark blue for VP
        } else if (designation.toLowerCase().includes('secretary')) {
            return '#0066cc'; // Blue for Secretary
        } else {
            return '#4a90e2'; // Light blue for others
        }
    };

    const formatAffiliation = (member: typeof committeeData.team[0]) => {
        let affiliation = `${member.professional_title}, ${member.organization}`;
        if (member.additional_info) {
            affiliation += `, ${member.additional_info}`;
        }
        return affiliation;
    };

    return (
        <div className="container py-16">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>
                    {committeeData.title} {committeeData.term}
                </h1>
                <p style={{ 
                    fontSize: '1.5rem', 
                    color: '#ff6b35', 
                    fontStyle: 'italic',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                }}>
                    {committeeData.body}
                </p>
                <p style={{ 
                    fontSize: '1.2rem', 
                    color: '#666',
                    marginTop: '1rem'
                }}>
                    Here's Our Team
                </p>
            </div>

            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem', textAlign: 'center' }}>
                Meet the dedicated members of the {committeeData.organization} {committeeData.body} who work tirelessly to
                strengthen our alumni network and support the growth of our alma mater.
            </p>
            
            <div style={{ 
                background: '#fff', 
                borderRadius: '10px', 
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '200px 1fr 1.5fr 1.5fr',
                    background: '#00274d',
                    color: 'white',
                    padding: '1.5rem',
                    fontWeight: '600'
                }}>
                    <div>Position</div>
                    <div>Name</div>
                    <div>Email</div>
                    <div>Affiliation</div>
                </div>
                
                {committeeData.team.map((member, index) => {
                    const isPresident = member.designation.toLowerCase().includes('president') && 
                                       !member.designation.toLowerCase().includes('vice');
                    return (
                        <div 
                            key={index}
                            style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '200px 1fr 1.5fr 1.5fr',
                                padding: '1.5rem',
                                borderBottom: index < committeeData.team.length - 1 ? '1px solid #e0e0e0' : 'none',
                                background: isPresident ? '#fff8f0' : '#fff',
                                transition: 'background 0.2s',
                                alignItems: 'center'
                            }}
                            onMouseEnter={(e) => {
                                if (!isPresident) e.currentTarget.style.background = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = isPresident ? '#fff8f0' : '#fff';
                            }}
                        >
                            <div>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    background: getBadgeClass(member.designation),
                                    color: 'white'
                                }}>
                                    {member.designation}
                                </span>
                            </div>
                            <div style={{ 
                                fontWeight: isPresident ? '600' : '400',
                                color: isPresident ? '#00274d' : '#333',
                                fontSize: isPresident ? '1.1rem' : '1rem'
                            }}>
                                {member.name}
                            </div>
                            <div style={{ 
                                color: '#666',
                                fontSize: '0.95rem'
                            }}>
                                <a 
                                    href={`mailto:${member.email}`}
                                    style={{ 
                                        color: '#0066cc',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                >
                                    {member.email}
                                </a>
                            </div>
                            <div style={{ 
                                color: '#666',
                                fontSize: '0.95rem',
                                lineHeight: '1.5'
                            }}>
                                {formatAffiliation(member)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile/Responsive Card View */}
            <div style={{
                display: 'none'
            }}
            className="mobile-committee-view"
            >
                {committeeData.team.map((member, index) => {
                    const isPresident = member.designation.toLowerCase().includes('president') && 
                                       !member.designation.toLowerCase().includes('vice');
                    return (
                        <div
                            key={index}
                            style={{
                                background: '#fff',
                                padding: '1.5rem',
                                borderRadius: '10px',
                                marginBottom: '1.5rem',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                borderLeft: `4px solid ${getBadgeClass(member.designation)}`
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <span style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: getBadgeClass(member.designation),
                                    color: 'white'
                                }}>
                                    {member.designation}
                                </span>
                            </div>
                            <h3 style={{
                                marginBottom: '0.5rem',
                                color: '#00274d',
                                fontSize: '1.1rem',
                                fontWeight: isPresident ? '600' : '400'
                            }}>
                                {member.name}
                            </h3>
                            <div style={{
                                marginBottom: '0.5rem',
                                color: '#666'
                            }}>
                                <strong>Email:</strong>{' '}
                                <a 
                                    href={`mailto:${member.email}`}
                                    style={{ 
                                        color: '#0066cc',
                                        textDecoration: 'none'
                                    }}
                                >
                                    {member.email}
                                </a>
                            </div>
                            <div style={{
                                color: '#666',
                                fontSize: '0.95rem',
                                lineHeight: '1.5'
                            }}>
                                <strong>Affiliation:</strong> {formatAffiliation(member)}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @media (max-width: 968px) {
                    .container > div:first-of-type > div:first-of-type {
                        display: none !important;
                    }
                    .mobile-committee-view {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ExecutiveCommittee;
