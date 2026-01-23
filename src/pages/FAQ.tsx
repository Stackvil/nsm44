import React, { useState, useMemo } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'Registration' | 'Donation' | 'Events' | 'General';
}

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Registration' | 'Donation' | 'Events' | 'General'>('All');

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "How do I register as an NSMOSA Alumni?",
      answer: "To register as an NSMOSA Alumni, click on the 'Register' button at the top right corner of the page. Fill in your details including your batch year and contact information. Once submitted, your registration will be reviewed and approved.",
      category: 'Registration'
    },
    {
      id: 2,
      question: "How can I contribute to NSMOSA?",
      answer: "There are many ways to contribute to NSMOSA. You can volunteer for committees, mentor current students, or contribute financially to our various initiatives like scholarships and infrastructure development.",
      category: 'Donation'
    },
    {
      id: 3,
      question: "What information do I need to register?",
      answer: "You will need your basic personal details, contact information, and your school batch year. Providing a profile photo and current professional details is also recommended to help other alumni connect with you.",
      category: 'Registration'
    },
    {
      id: 4,
      question: "What is the minimum donation amount?",
      answer: "There is no minimum donation amount. Every contribution, no matter how small, helps us support our alma mater and alumni community. You can choose to donate to specific causes or to the general fund.",
      category: 'Donation'
    },
    {
      id: 5,
      question: "How can I participate in NSMOSA Alumni events?",
      answer: "We organize various events throughout the year. You can view upcoming events in the 'Events' section. To participate, simply register for the event you are interested in. Some events may have a participation fee.",
      category: 'Events'
    },
    {
      id: 6,
      question: "How do I update my profile information?",
      answer: "Log in to your account and navigate to 'My Profile'. Here you can edit your personal details, contact info, and professional background. Don't forget to save your changes.",
      category: 'General'
    },
    {
      id: 7,
      question: "How can I connect with other NSMOSA Alumni?",
      answer: "Connecting with fellow NSMOSA Alumni is easy! You can use our Alumni Directory to find batchmates, join our official social media groups, or attend our regular chapter meets.",
      category: 'General'
    }
  ];

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const categories: ('All' | 'Registration' | 'Donation' | 'Events' | 'General')[] = ['All', 'Registration', 'Donation', 'Events', 'General'];

  return (
    <div className="container py-16" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

      {/* Search Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2rem', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search for questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem 1rem 3rem',
            borderRadius: '50px',
            border: '1px solid #e0e0e0',
            fontSize: '1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            outline: 'none'
          }}
        />
        <i className="fas fa-search" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: activeCategory === cat ? '#00274d' : '#fff',
              color: activeCategory === cat ? '#fff' : '#555',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {filteredFAQs.map((faq) => (
          <div
            key={faq.id}
            className={`faq-item ${activeIndex === faq.id ? 'active' : ''}`}
            style={{
              marginBottom: '1rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <button
              className="faq-question"
              onClick={() => toggleAccordion(faq.id)}
              style={{
                width: '100%',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#333'
              }}
            >
              {faq.question}
              <span
                style={{
                  transform: activeIndex === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  color: '#00274d'
                }}
              >
                <i className="fas fa-chevron-down"></i>
              </span>
            </button>
            <div
              className="faq-answer"
              style={{
                padding: activeIndex === faq.id ? '0 1.5rem 1.5rem' : '0 1.5rem',
                maxHeight: activeIndex === faq.id ? '1000px' : '0',
                opacity: activeIndex === faq.id ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                color: '#555',
                lineHeight: '1.6'
              }}
            >
              <div>{faq.answer}</div>
            </div>
          </div>
        ))}
        {filteredFAQs.length === 0 && (
          <div style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
            No questions found related to your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
