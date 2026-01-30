import React from 'react';
import ReactDOM from 'react-dom/client';
import AlumniEvent from './pages/connect/AlumniEvent';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

export function mountAlumniEvents() {
    const rootEl = document.getElementById('alumni-event-connect-section');
    if (!rootEl) return;

    // Find the events grid to replace, or append if not found
    const eventsGrid = rootEl.querySelector('.events-grid');

    // Check if we already mounted to avoid dupes 
    if (rootEl.hasAttribute('data-react-mounted')) return;

    const mountPoint = document.createElement('div');
    mountPoint.id = 'react-alumni-events-mount';

    if (eventsGrid) {
        // Replace the static grid with our mount point
        eventsGrid.parentNode?.replaceChild(mountPoint, eventsGrid);
    } else {
        // Append to the section if grid is already gone
        rootEl.appendChild(mountPoint);
    }

    const root = ReactDOM.createRoot(mountPoint);
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <BrowserRouter>
                        {/* We wrap it in a div to ensure full width */}
                        <div style={{ width: '100%', padding: '20px 0' }}>
                            <AlumniEvent />
                        </div>
                    </BrowserRouter>
                </AuthProvider>
            </QueryClientProvider>
        </React.StrictMode>
    );

    rootEl.setAttribute('data-react-mounted', 'true');
    console.log('Alumni Events widget mounted.');
}
