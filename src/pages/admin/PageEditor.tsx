import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import Button from '../../components/Button';

const PageEditor: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get(`/content/${slug}`);
                // If content exists, use it. If it's a string (JSON), parse it.
                let data = res.data.content;
                if (typeof data === 'string') {
                    try { data = JSON.parse(data); } catch (e) { }
                }
                setContent(data || {});
            } catch (err) {
                console.error(err);
                // If 404, just start with empty object
                setContent({});
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchContent();
    }, [slug]);

    const handleChange = (key: string, value: string) => {
        setContent((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Send content as JSON object. 
            // The backend stores it as JSON (Postgres) or String (SQLite with my fix?).
            // Wait, my backend implementation for SQLite used `String` for arrays in OTHER models.
            // But `PageContent` model has `content Json`. 
            // In SQLite, Prisma maps `Json` to `String` automatically.
            // So sending an object { ... } should work fine.

            await api.put(`/content/${slug}`, { content });
            setSuccess('Page content updated successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to save content.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !content) return <div>Loading...</div>;

    // Defines the fields we can edit for "Data-driven" approach
    // We can default to some fields if empty
    const fields = [
        { key: 'heroTitle', label: 'Hero Title', type: 'text' },
        { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Edit {slug} Page</h1>
                <Button variant="outline" onClick={() => navigate('/admin')}>Back</Button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

            <div className="bg-white p-6 rounded shadow max-w-2xl">
                {fields.map((field) => (
                    <div key={field.key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                            <textarea
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                                value={content[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                value={content[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                            />
                        )}
                    </div>
                ))}

                <div className="mt-6 flex justify-end">
                    <Button variant="primary" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PageEditor;
