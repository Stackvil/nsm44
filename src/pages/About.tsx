import React, { useState, useEffect } from 'react';
import api from '../api';

const About: React.FC = () => {
    const [pageContent, setPageContent] = useState<any>({});

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/content/about');
                let data = res.data.content;
                if (typeof data === 'string') {
                    try { data = JSON.parse(data); } catch (e) { }
                }
                setPageContent(data || {});
            } catch (err) {
                console.log('Using default content');
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{pageContent.title || 'About NSM Alumni Association'}</h1>
            <div className="prose max-w-none">
                <h2>President's Message</h2>
                <p>{pageContent.presidentMessage || 'Welcome message from the president.'}</p>
                <h2>Committee Information</h2>
                <p>{pageContent.committeeInfo || 'Information about the committee.'}</p>
            </div>
        </div>
    );
};

export default About;