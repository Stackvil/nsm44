import React from 'react';

interface OfficeBearer {
    name: string;
    designation: string;
    email: string;
    professionalTitle: string;
    organization: string;
    additionalInfo?: string;
    location?: string;
    photo?: string;
}

interface CommitteeData {
    organization: string;
    committee: string;
    term: string;
    officeBearers: OfficeBearer[];
}

const ExecutiveCommittee: React.FC = () => {
    const committeeData: CommitteeData = {
        organization: "NSM Alumni",
        committee: "Governing Council",
        term: "2024-27",
        officeBearers: [
            {
                name: "Venkat Jagdish Nalluri",
                designation: "President",
                email: "vinots@gmail.com",
                professionalTitle: "Managing Director",
                organization: "OTS Advertisings",
                photo: "president.jpg"
            },
            {
                name: "Gurjeet Singh Sahni",
                designation: "General Secretary",
                email: "vjwgurjeet@gmail.com",
                professionalTitle: "Managing Director",
                organization: "Sahni Auto Pvt Ltd",
                additionalInfo: "Dealer for Tata Commercial Vehicles",
                photo: "general_secretary.jpg"
            },
            {
                name: "Jayanarayana Kureti",
                designation: "Sr. Vice President",
                email: "jaykureti@gmail.com",
                professionalTitle: "Founder & CEO",
                organization: "Jaan Entertainment Pvt Ltd",
                location: "ETHREE, Rajiv Gandhi Park",
                photo: "sr_vice_president.jpg"
            },
            {
                name: "Ayesha Khatoon",
                designation: "Sr. Secretary",
                email: "aaeshakhatoon10@gmail.com",
                professionalTitle: "Optometrist",
                organization: "Dilip Opticals",
                photo: "sr_secretary.jpg"
            },
            {
                name: "Jaideep Arza",
                designation: "Jr. Vice President",
                email: "ajaideep@gmail.com",
                professionalTitle: "Proprietor",
                organization: "Sri Dhanalakshmi Stones & Tiles",
                photo: "jr_vice_president.jpg"
            },
            {
                name: "Kowtha V. Subba Rao",
                designation: "Treasurer",
                email: "kowtha@hotmail.com",
                professionalTitle: "Chartered Accountant",
                organization: "M/s Kowtha & Co.",
                photo: "treasurer.jpg"
            },
            {
                name: "Suhrith Durbha",
                designation: "Jr. Secretary",
                email: "suhrith.raja@gmail.com",
                professionalTitle: "Business Associate",
                organization: "Bank of Baroda",
                photo: "jr_secretary.jpg"
            }
        ]
    };

    const getProfessionalDetails = (member: OfficeBearer): string => {
        let details = `${member.professionalTitle}, ${member.organization}`;
        if (member.additionalInfo) {
            details += `, ${member.additionalInfo}`;
        }
        if (member.location) {
            details += `, ${member.location}`;
        }
        return details;
    };

    const getBadgeColor = (designation: string) => {
        const des = designation.toLowerCase();
        if (des.includes('president') && !des.includes('vice') && !des.includes('sr.') && !des.includes('jr.')) {
            return '#ff6b35'; // Orange for President
        } else if (des.includes('vice president')) {
            return '#718096'; // Gray for Vice President
        } else if (des.includes('secretary')) {
            return '#718096'; // Gray for Secretary
        } else if (des.includes('treasurer')) {
            return '#4a90e2'; // Light blue for Treasurer
        } else {
            return '#4a90e2'; // Light blue for others
        }
    };

    return (
        <div className="container py-16">
            <h2 className="page-title" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {committeeData.organization} - {committeeData.committee}
            </h2>
            <p style={{ marginBottom: '0.5rem', color: '#00274d', fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>
                Term: {committeeData.term}
            </p>
            {/* Updated: 2024-27 Executive Committee */}
            <p style={{ marginBottom: '3rem', color: '#666', fontSize: '1.1rem', textAlign: 'center' }}>
                Meet the dedicated members of the NSM Old Students Association Executive Committee who work tirelessly to
                strengthen our alumni network and support the growth of our alma mater.
            </p>
            
            <div style={{ 
                background: '#fff', 
                borderRadius: '15px', 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0'
            }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '200px 1fr 1fr',
                    gap: '20px',
                    background: '#00274d',
                    color: 'white',
                    padding: '20px 30px',
                    fontWeight: '600'
                }}>
                    <div>Designation</div>
                    <div>Name</div>
                    <div>Professional Details</div>
                </div>
                
                {committeeData.officeBearers.map((member, index) => {
                    const isPresident = member.designation.toLowerCase() === 'president';
                    return (
                        <div 
                            key={index}
                            style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '200px 1fr 1fr',
                                gap: '20px',
                                padding: '20px 30px',
                                borderBottom: index < committeeData.officeBearers.length - 1 ? '1px solid #f0f0f0' : 'none',
                                background: isPresident ? '#fff8f0' : '#fff',
                                transition: 'background 0.3s',
                                alignItems: 'center',
                                borderLeft: isPresident ? '4px solid #ff6b35' : 'none'
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
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: getBadgeColor(member.designation),
                                    color: 'white',
                                    textTransform: 'uppercase'
                                }}>
                                    {member.designation}
                                </span>
                            </div>
                            <div style={{ 
                                fontWeight: isPresident ? '600' : '400',
                                color: '#333',
                                fontSize: '1rem'
                            }}>
                                {member.name}
                                {member.email && (
                                    <div style={{ 
                                        fontSize: '0.85rem', 
                                        color: '#666', 
                                        marginTop: '0.25rem',
                                        fontWeight: 'normal'
                                    }}>
                                        {member.email}
                                    </div>
                                )}
                            </div>
                            <div style={{ 
                                color: '#666',
                                fontSize: '0.95rem'
                            }}>
                                {getProfessionalDetails(member)}
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
                {committeeData.officeBearers.map((member, index) => {
                    const isPresident = member.designation.toLowerCase() === 'president';
                    return (
                        <div
                            key={index}
                            style={{
                                background: '#fff',
                                padding: '1.5rem',
                                borderRadius: '10px',
                                marginBottom: '1.5rem',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                borderLeft: `4px solid ${getBadgeColor(member.designation)}`
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
                                    background: getBadgeColor(member.designation),
                                    color: 'white',
                                    textTransform: 'uppercase'
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
                            {member.email && (
                                <div style={{
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <strong>Email:</strong> {member.email}
                                </div>
                            )}
                            <div style={{
                                color: '#666',
                                fontSize: '0.95rem',
                                lineHeight: '1.5'
                            }}>
                                <strong>Professional Details:</strong> {getProfessionalDetails(member)}
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
