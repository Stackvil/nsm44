import React, { useState, useEffect } from 'react';
import api from '../api';

const Reunion: React.FC = () => {
    const [pageContent, setPageContent] = useState<any>({});

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/content/reunion');
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
            <h1 className="text-3xl font-bold mb-6">{pageContent.title || 'Reunion'}</h1>
            <div className="prose max-w-none">
                <p>{pageContent.description || 'Reunion details.'}</p>
                <h2>Gallery</h2>
                {/* Render gallery images */}
                {pageContent.galleryImages && Array.isArray(pageContent.galleryImages) && (
                    <div className="grid grid-cols-3 gap-4">
                        {pageContent.galleryImages.map((img: string, index: number) => (
                            <img key={index} src={img} alt="Gallery" className="w-full h-32 object-cover" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reunion;