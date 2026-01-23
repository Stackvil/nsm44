import React from 'react';
import ReactDOM from 'react-dom/client';
import FAQ from './pages/FAQ';

export function mountFAQ() {
    const rootEl = document.getElementById('page-faq');
    if (rootEl && !rootEl.hasAttribute('data-mounted')) {
        const root = ReactDOM.createRoot(rootEl);
        root.render(
            <React.StrictMode>
                <FAQ />
            </React.StrictMode>
        );
        rootEl.setAttribute('data-mounted', 'true');
        console.log('FAQ React component mounted successfully.');
    }
}
