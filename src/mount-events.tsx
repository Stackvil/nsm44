import React from 'react';
import ReactDOM from 'react-dom/client';
import Events from './pages/Events';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for the events specific mount
const queryClient = new QueryClient();

export function mountEvents() {
    const rootEl = document.getElementById('page-events');
    if (rootEl && !rootEl.hasAttribute('data-mounted')) {
        // Clear any legacy HTML content
        rootEl.innerHTML = '';
        rootEl.style.minHeight = '80vh'; // Ensure it takes up space

        const root = ReactDOM.createRoot(rootEl);
        root.render(
            <React.StrictMode>
                <QueryClientProvider client={queryClient}>
                    <Events />
                </QueryClientProvider>
            </React.StrictMode>
        );
        rootEl.setAttribute('data-mounted', 'true');
        console.log('Events React component mounted successfully into #page-events.');
    }
}
