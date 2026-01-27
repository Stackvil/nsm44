import { DB, EventPhoto } from './db';

// ==========================================
// Event Management Logic
// ==========================================
let currentEventCategory = '';
// Valid types for our photos state
interface DraftPhoto {
    id?: string;
    url: string;
    file?: File;
    name: string;
    isNew: boolean;
    uploadedAt?: number;
}
let currentDraftPhotos: DraftPhoto[] = [];
let currentEditingEventId: string | null = null;

// Video Management State
let uploadedVideoBlob: Blob | null = null;



// Show event category details
(window as any).showEventCategory = (category: string) => {
    currentEventCategory = category;
    const categoriesView = document.getElementById('event-categories-view');
    const detailsView = document.getElementById('event-details-view');
    const titleEl = document.getElementById('event-category-title');

    if (categoriesView && detailsView && titleEl) {
        categoriesView.style.display = 'none';
        detailsView.style.display = 'block';
        titleEl.textContent = category === 'social' ? 'Social Events' : 'NSMOSA Events';
        loadCategoryEvents(category as 'social' | 'nsmosa');
    }
};

// Back to categories
(window as any).backToEventCategories = () => {
    const categoriesView = document.getElementById('event-categories-view');
    const detailsView = document.getElementById('event-details-view');

    if (categoriesView && detailsView) {
        categoriesView.style.display = 'grid';
        detailsView.style.display = 'none';
    }
};

// Load events for a category
// Load events for a category
async function loadCategoryEvents(category: 'social' | 'nsmosa') {
    const grid = document.getElementById('event-years-grid');
    if (!grid) return;

    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Loading...</p></div>';

    try {
        let allEvents = await DB.getEvents();

        // Include System Defaults for consistency with the main page
        const systemDefaults: EventPhoto[] = [
            {
                id: 'social-2024-default',
                eventName: 'Annual General Body Meeting',
                category: 'social',
                year: 2024,
                photos: Array(15).fill({ url: '/images/social-events/Gen%20Sec%20report%20PPT%202024-25-1.jpg', name: 'Slide 1' }),
                eventDate: '2024-01-01',
                createdAt: 0
            },
            {
                id: 'nsmosa-jubilee-default',
                eventName: 'Golden Jubilee Celebrations',
                category: 'nsmosa',
                year: 2023,
                photos: Array(60).fill({ url: '/images/golden%20jublee%20celebrations/golden%20jublee%20celebrations/Gen%20Sec%20report%202023-24-1.jpg', name: 'Jubilee 1' }),
                eventDate: '2023-01-01',
                createdAt: 0
            }
        ];

        // Merge defaults
        const relevantDefaults = systemDefaults.filter(d => d.category === category && !allEvents.some(e => e.id === d.id));
        const categoryEvents = [...allEvents.filter(e => e.category === category), ...relevantDefaults];

        if (categoryEvents.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
                    <i class="fas fa-calendar-alt" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5; display: block;"></i>
                    <p>No events found in this category. Create one to get started!</p>
                </div>
            `;
            return;
        }

        // Sort events by year descending
        categoryEvents.sort((a, b) => b.year - a.year);

        // Render card for EACH event (no grouping)
        grid.innerHTML = categoryEvents.map(event => {
            const coverImage = event.photos.length > 0 ? event.photos[0].url : '';

            return `
                <div class="event-year-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); transition: transform 0.3s ease; border: 1px solid #eee; cursor: pointer;"
                    onclick="viewYearEvents('${category}', ${event.year}, '${event.id}')"
                    onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.12)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.08)'">
                    <div style="position: relative; aspect-ratio: 4/3; overflow: hidden; background: #f8fafc;">
                        ${coverImage
                    ? `<img src="${coverImage}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;"><i class="fas fa-image" style="color: #cbd5e1; font-size: 32px;"></i></div>`
                }
                        <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 8px;">
                            <button onclick="event.stopPropagation(); window.editEvent('${event.id}')" title="Edit Event" style="width: 32px; height: 32px; border-radius: 6px; background: white; border: none; color: #004e92; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="event.stopPropagation(); window.deleteEvent('${event.id}')" title="Delete Event" style="width: 32px; height: 32px; border-radius: 6px; background: white; border: none; color: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div style="padding: 15px; text-align: center;">
                        <h5 style="margin: 0 0 5px 0; font-size: 1.1rem; font-weight: 700; color: #00274d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${event.eventName}">${event.eventName}</h5>
                        <p style="margin: 0 0 10px 0; font-size: 0.9rem; font-weight: 600; color: #004e92;">${event.year}</p>
                        <span style="display: block; font-size: 0.85rem; color: #64748b;">${event.photos.length} Photos</span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: #ef4444;">Error loading events</div>';
    }
}

// View events for a specific year (or specific event)
(window as any).viewYearEvents = async (category: string, year: number, targetEventId?: string) => {
    const isGallery = category === 'gallery';

    // Different sets of UI elements for "Event Management" vs "Gallery Management"
    const mainView = isGallery ? document.getElementById('admin-gallery-main-view') : document.getElementById('event-details-view');
    const imagesView = isGallery ? document.getElementById('admin-gallery-images-view') : document.getElementById('year-images-view');
    const grid = isGallery ? document.getElementById('gallery-images-grid') : document.getElementById('admin-event-photos-grid');
    const titleEl = isGallery ? document.getElementById('gallery-current-name-display') : document.getElementById('year-detail-title');
    const subtitleEl = isGallery ? document.getElementById('gallery-current-year-display') : document.getElementById('year-detail-subtitle');

    if (!mainView || !imagesView || !grid) return;

    try {
        const allEvents = await DB.getEvents();

        // Add defaults if applicable
        const systemDefaults: EventPhoto[] = [
            {
                id: 'social-2024-default',
                eventName: 'Annual General Body Meeting',
                category: 'social',
                year: 2024,
                photos: Array(15).fill({ url: '/images/social-events/Gen%20Sec%20report%20PPT%202024-25-1.jpg', name: 'Slide 1' }),
                eventDate: '2024-01-01',
                createdAt: 0
            },
            {
                id: 'nsmosa-jubilee-default',
                eventName: 'Golden Jubilee Celebrations',
                category: 'nsmosa',
                year: 2023,
                photos: Array(60).fill({ url: '/images/golden%20jublee%20celebrations/golden%20jublee%20celebrations/Gen%20Sec%20report%202023-24-1.jpg', name: 'Jubilee 1' }),
                eventDate: '2023-01-01',
                createdAt: 0
            }
        ];

        let events = [...allEvents, ...systemDefaults.filter(d => !allEvents.find(e => e.id === d.id))];
        let categoryEvents = events.filter(e => e.category === category && e.year === year);

        if (targetEventId) {
            categoryEvents = categoryEvents.filter(e => e.id === targetEventId);
        }

        if (categoryEvents.length > 0) {
            const event = categoryEvents[0];
            if (titleEl) titleEl.textContent = event.eventName;
            if (subtitleEl) subtitleEl.textContent = isGallery ? `Year: ${event.year}` : `${event.photos.length} Photos • ${event.year}`;
        } else {
            if (titleEl) titleEl.textContent = isGallery ? 'Gallery Images' : `Events - ${year}`;
            if (subtitleEl) subtitleEl.textContent = `0 Items Found`;
        }

        // Generate HTML
        grid.innerHTML = categoryEvents.map(event => {
            const photos = event.photos || [];
            return `
            <div style="grid-column: 1/-1; ${isGallery ? '' : 'margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;'}">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px;">
                    ${photos.length > 0 ? photos.map(photo => `
                        <div class="gallery-image-card" style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #eee; position: relative;">
                            <img src="${photo.url || '/images/placeholder.jpg'}" style="width: 100%; height: 130px; object-fit: cover; cursor: pointer;" onclick="window.openLightbox(this.src)">
                            <button onclick="event.stopPropagation(); window.deleteEventImage('${event.id}', '${photo.id}')" 
                                style="position: absolute; top: 5px; right: 5px; width: 28px; height: 28px; border-radius: 50%; background: white; border: 1px solid #ef4444; color: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); opacity: 0.9; transition: all 0.2s;"
                                onmouseover="this.style.background='#ef4444'; this.style.color='white'"
                                onmouseout="this.style.background='white'; this.style.color='#ef4444'"
                                title="Delete Photo">
                                <i class="fas fa-trash" style="font-size: 12px;"></i>
                            </button>
                        </div>
                    `).join('') : '<p style="grid-column: 1/-1; color: #666; font-style: italic;">No photos in this gallery.</p>'}
                </div>
            </div>
        `;
        }).join('');

        mainView.style.display = 'none';
        imagesView.style.display = 'block';

        // Set up the back button for gallery if it exists
        const galleryBackBtn = document.getElementById('back-to-gallery-list-btn');
        if (galleryBackBtn) {
            galleryBackBtn.onclick = () => {
                imagesView.style.display = 'none';
                mainView.style.display = 'block';
            };
        }

    } catch (error) {
        console.error('Error viewing events:', error);
        alert('Could not load photos.');
    }
};


// Delete single image from event
(window as any).deleteEventImage = async (eventId: string, photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
        const events = await DB.getEvents();
        const event = events.find(e => e.id === eventId);

        if (event) {
            if (eventId.includes('default')) {
                alert('Cannot delete photos from system default events.');
                return;
            }

            const updatedPhotos = event.photos.filter(p => p.id !== photoId);
            event.photos = updatedPhotos;
            await DB.saveEvent(event);

            // Refresh view - pass event.id to keep looking at this event
            (window as any).viewYearEvents(event.category, event.year, event.id);
            // Also update public view
            (window as any).updatePublicEventsPage();
        }
    } catch (e) {
        console.error('Error deleting photo:', e);
        alert('Failed to delete photo.');
    }
};

(window as any).backToYearGrid = () => {
    const isGalleryViewVisible = document.getElementById('admin-gallery-images-view')?.style.display === 'block';

    if (isGalleryViewVisible) {
        const mainView = document.getElementById('admin-gallery-main-view');
        const imagesView = document.getElementById('admin-gallery-images-view');
        if (mainView && imagesView) {
            mainView.style.display = 'block';
            imagesView.style.display = 'none';
        }
    } else {
        const yearGridView = document.getElementById('event-details-view');
        const photoGridView = document.getElementById('year-images-view');
        if (yearGridView && photoGridView) {
            yearGridView.style.display = 'block';
            photoGridView.style.display = 'none';
        }
    }
};


// Delete all events for a year
(window as any).deleteYearEvents = async (category: string, year: number) => {
    if (confirm(`Are you sure you want to delete all events from ${year}?`)) {
        const allEvents = await DB.getEvents();
        const eventsToDelete = allEvents.filter(e => e.category === category && e.year === year);

        for (const event of eventsToDelete) {
            await DB.deleteEvent(event.id);
        }

        if (currentEventCategory) {
            loadCategoryEvents(currentEventCategory as 'social' | 'nsmosa');
        }
    }
};

// View event gallery
(window as any).viewEventGallery = async (id: string) => {
    alert('View event gallery - ID: ' + id);
};

// Delete event
(window as any).deleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
        await DB.deleteEvent(id);

        // Refresh the main category list
        if (currentEventCategory) {
            loadCategoryEvents(currentEventCategory as 'social' | 'nsmosa');
        }

        // If we are currently viewing the deleted event's details, go back to the list
        // We can infer this if the detail view is active or simply force back navigation if needed.
        // A simple heuristic: search the DOM for the deleted event ID in the grid if we are in detail view.
        // Or just safer:
        const detailView = document.getElementById('year-images-view');
        if (detailView && detailView.style.display !== 'none') {
            // We assume we might be looking at it, but let's just go back to be safe/clear
            (window as any).backToYearGrid();
        }
    }
};

// Edit event
(window as any).editEvent = async (id: string) => {
    if (id.includes('default')) {
        alert('System default events cannot be edited.');
        return;
    }

    try {
        const events = await DB.getEvents();
        const event = events.find(e => e.id === id);

        if (!event) {
            alert('Event not found.');
            return;
        }

        currentEditingEventId = id;

        // Open Modal
        (window as any).openCreateEventModal();

        // Populate Modal
        const nameInput = document.getElementById('event-name') as HTMLInputElement;
        const categoryInput = document.getElementById('event-category') as HTMLSelectElement;
        const yearInput = document.getElementById('event-year') as HTMLInputElement;
        const modalTitle = document.querySelector('#create-event-modal h3');
        const submitBtn = document.querySelector('#create-event-form button[type="submit"]');

        if (nameInput) nameInput.value = event.eventName;
        if (categoryInput) categoryInput.value = event.category;
        if (yearInput) yearInput.value = event.year.toString();
        if (modalTitle) modalTitle.innerHTML = '<i class="fas fa-edit" style="color: #004e92; margin-right: 10px;"></i> Edit Event';
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-check"></i> Update Event';

        // Load existing photos into draft state
        currentDraftPhotos = event.photos.map(p => ({
            id: p.id,
            url: p.url,
            name: p.name,
            uploadedAt: p.uploadedAt,
            isNew: false
        }));

        (window as any).renderDraftPhotos();

    } catch (e) {
        console.error('Error loading event for edit:', e);
    }
};

// Open create event modal
(window as any).openCreateEventModal = (mode?: string) => {
    const modal = document.getElementById('create-event-modal');
    const categoryInput = document.getElementById('event-category') as HTMLInputElement;
    const categoryGroup = categoryInput?.parentElement; // Assuming standard form structure

    if (modal) {
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0,0,0,0.7)';
        modal.style.zIndex = '10000';
        currentDraftPhotos = [];
        currentEditingEventId = null;
        (window as any).renderDraftPhotos();

        const modalTitle = document.querySelector('#create-event-modal h3');
        const submitBtn = document.querySelector('#create-event-form button[type="submit"]');

        if (mode === 'gallery') {
            if (modalTitle) modalTitle.innerHTML = '<i class="fas fa-images" style="color: #004e92; margin-right: 10px;"></i> Add New Gallery';
            if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-check"></i> Create Gallery';
            // Set category to gallery and hide selector
            if (categoryInput) {
                // Check if 'gallery' option exists, if not add it temporarily or just set value
                if (!categoryInput.querySelector('option[value="gallery"]')) {
                    const opt = document.createElement('option');
                    opt.value = 'gallery';
                    opt.text = 'Gallery';
                    categoryInput.appendChild(opt);
                }
                categoryInput.value = 'gallery';
                if (categoryGroup) categoryGroup.style.display = 'none';
            }
        } else {
            if (modalTitle) modalTitle.innerHTML = '<i class="fas fa-calendar-plus" style="color: #004e92; margin-right: 10px;"></i> Create New Event';
            if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-check"></i> Create Event';
            // Show selector
            if (categoryGroup) categoryGroup.style.display = 'block';
            if (categoryInput) categoryInput.value = '';
        }
    }
};

// Open create event modal for specific category
(window as any).openCreateEventModalForCategory = () => {
    const modal = document.getElementById('create-event-modal');
    const categoryInput = document.getElementById('event-category') as HTMLInputElement;

    if (modal) {
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0,0,0,0.7)';
        modal.style.zIndex = '10000';
        currentDraftPhotos = [];

        // Pre-select the current category
        if (categoryInput && currentEventCategory) {
            categoryInput.value = currentEventCategory;
        }
    }
};

// Close create event modal
(window as any).closeCreateEventModal = () => {
    const modal = document.getElementById('create-event-modal');
    const form = document.getElementById('create-event-form') as HTMLFormElement;
    const preview = document.getElementById('event-image-preview');

    if (modal) modal.style.display = 'none';
    if (form) form.reset();
    if (preview) preview.innerHTML = '';
    currentDraftPhotos = [];
    currentEditingEventId = null;
};

// Preview event images
(window as any).previewEventImages = () => {
    const input = document.getElementById('event-images') as HTMLInputElement;
    if (!input || !input.files) return;

    const newFiles = Array.from(input.files);

    newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentDraftPhotos.push({
                url: e.target?.result as string,
                file: file,
                name: file.name,
                isNew: true
            });
            (window as any).renderDraftPhotos();
        };
        reader.readAsDataURL(file);
    });

    // Clear input so same file can be selected again if needed
    input.value = '';
};

// Render draft photos grid
(window as any).renderDraftPhotos = () => {
    const preview = document.getElementById('event-image-preview');
    if (!preview) return;

    if (currentDraftPhotos.length === 0) {
        preview.innerHTML = '';
        return;
    }

    // Use a grid layout for preview
    preview.style.display = 'grid';
    preview.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
    preview.style.gap = '10px';
    preview.style.marginTop = '10px';

    preview.innerHTML = currentDraftPhotos.map((photo, index) => `
        <div style="position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
            <img src="${photo.url}" style="width: 100%; height: 100%; object-fit: cover;">
            <button onclick="window.removeDraftPhoto(${index})" type="button" 
                style="position: absolute; top: 4px; right: 4px; background: rgba(239, 68, 68, 0.9); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                <i class="fas fa-times"></i>
            </button>
            ${photo.isNew ? '<span style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(59, 130, 246, 0.8); color: white; font-size: 10px; text-align: center; padding: 2px;">New</span>' : ''}
        </div>
    `).join('');
};

// Remove draft photo
(window as any).removeDraftPhoto = (index: number) => {
    currentDraftPhotos.splice(index, 1);
    (window as any).renderDraftPhotos();
};

// Save event
(window as any).saveEvent = async () => {
    const nameInput = document.getElementById('event-name') as HTMLInputElement;
    const categoryInput = document.getElementById('event-category') as HTMLSelectElement;
    const yearInput = document.getElementById('event-year') as HTMLInputElement;
    const btn = document.querySelector('#create-event-form button[type="submit"]') as HTMLButtonElement;

    if (!nameInput.value || !categoryInput.value || !yearInput.value) {
        alert('Please fill all required fields');
        return;
    }

    if (currentDraftPhotos.length === 0) {
        alert('Please ensure the event has at least one photo.');
        return;
    }

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        }

        // Construct final photos array
        const finalPhotos = currentDraftPhotos.map((p, index) => {
            if (!p.isNew) {
                return {
                    id: p.id || `${Date.now()}-${index}`,
                    url: p.url,
                    name: p.name,
                    uploadedAt: p.uploadedAt || Date.now()
                };
            } else {
                return {
                    id: `${Date.now()}-${index}`,
                    url: p.url,
                    name: p.name,
                    uploadedAt: Date.now()
                };
            }
        });

        const newEvent: EventPhoto = {
            id: currentEditingEventId || `event-${Date.now()}`,
            eventName: nameInput.value,
            eventDate: new Date().toISOString(),
            category: categoryInput.value as 'social' | 'nsmosa' | 'gallery',

            year: parseInt(yearInput.value),
            photos: finalPhotos,
            createdAt: Date.now()
        };

        // If editing, try to preserve original created date
        if (currentEditingEventId) {
            const existingEvents = await DB.getEvents();
            const original = existingEvents.find(e => e.id === currentEditingEventId);
            if (original) newEvent.createdAt = original.createdAt;
        }

        await DB.saveEvent(newEvent);

        alert(`Event "${nameInput.value}" ${currentEditingEventId ? 'updated' : 'created'} successfully!`);

        (window as any).closeCreateEventModal();

        // Reload the category if we're viewing one
        if (currentEventCategory) {
            loadCategoryEvents(currentEventCategory as 'social' | 'nsmosa');
        }

        // Update public views
        (window as any).updatePublicEventsPage();
        if ((window as any).loadAdminGalleries) (window as any).loadAdminGalleries();

        // If we are in the detailed view of THIS event, refresh it
        // Simple check if we are in detailed view (element visible)
        const detailView = document.getElementById('year-images-view');
        if (detailView && detailView.style.display !== 'none') {
            // We assume we might be looking at list or specific view. 
            // To be safe, we reload the specific view for this event which works fine even if we were just looking at it.
            (window as any).viewYearEvents(newEvent.category, newEvent.year, newEvent.id);
        }

    } catch (error) {
        console.error('Error saving event:', error);
        alert('Failed to save event. Please try again.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = currentEditingEventId ? '<i class="fas fa-check"></i> Update Event' : '<i class="fas fa-check"></i> Create Event';
        }
    }
};

// Update public events page from DB
(window as any).updatePublicEventsPage = async () => {
    try {
        const events = await DB.getEvents();

        // 1. Photo Gallery Page (the big grid)
        const photoGalleryGrid = document.getElementById('public-photo-gallery-grid');
        if (photoGalleryGrid) {
            photoGalleryGrid.innerHTML = '';

            // Filter to ONLY show items from "Gallery Management" (category: 'gallery')
            const galleryOnlyEvents = events.filter(e => e.category === 'gallery');

            galleryOnlyEvents.sort((a, b) => b.createdAt - a.createdAt).forEach(event => {
                const card = document.createElement('div');
                card.className = 'year-box';
                card.style.cssText = 'background: white; border-radius: 15px; position: relative; overflow: hidden; height: 200px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.3s ease; border: none;';
                card.onclick = () => (window as any).openAlbum(event.id);

                const coverImage = event.photos.length > 0 ? event.photos[0].url : '/images/placeholder.jpg';
                card.innerHTML = `
                    <img src="${coverImage}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">
                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px;">
                        <div style="color: rgba(255,255,255,0.7); font-weight: 600; font-size: 14px; margin-bottom: 2px;">${event.year}</div>
                        <h4 style="margin: 0; font-size: 22px; color: white;">${event.eventName}</h4>
                        <p style="margin: 5px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${event.photos.length} Photos</p>
                    </div>
                `;
                photoGalleryGrid.appendChild(card);
            });
        }

        // 2. Social Events Public Grid
        const socialGrid = document.getElementById('social-events-public-grid');
        if (socialGrid) {
            const systemDefaults: EventPhoto[] = [
                {
                    id: 'social-2024-default',
                    eventName: 'Annual General Body Meeting',
                    category: 'social',
                    year: 2024,
                    eventDate: '2024-01-01',
                    photos: Array(15).fill({ url: '/images/social-events/Gen%20Sec%20report%20PPT%202024-25-1.jpg', name: 'Slide 1' }),
                    createdAt: 0
                }
            ];

            // Merge defaults
            const socialEvents = [
                ...events.filter(e => e.category === 'social'),
                ...systemDefaults.filter(d => d.category === 'social' && !events.find(e => e.id === d.id))
            ];


            if (socialEvents.length === 0) {
                socialGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
                        <p>No social events found.</p>
                    </div>
                `;
            } else {
                socialGrid.innerHTML = '';

                // Group by year to check if we have multiple events per year or just list them
                // The previous design was per-year cards. 
                // "2024-25 Annual General Body Meeting"
                // Let's sort by year desc
                socialEvents.sort((a, b) => b.year - a.year);

                socialEvents.forEach(event => {
                    const card = document.createElement('div');
                    card.onclick = () => (window as any).openAlbum(event.id, 'social-years-view');
                    card.className = 'year-box';
                    card.style.cssText = 'background: white; border-radius: 15px; position: relative; overflow: hidden; height: 200px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.3s ease; border: none;';
                    card.onmouseover = () => { card.style.transform = 'translateY(-5px)'; };
                    card.onmouseout = () => { card.style.transform = 'translateY(0)'; };

                    const coverImage = event.photos.length > 0 ? event.photos[0].url : '/images/placeholder.jpg';
                    const displayYear = event.year; // + (event.year === 2024 ? '-25' : ''); // Optional: Add academic year logic if needed

                    card.innerHTML = `
                         <img src="${coverImage}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; transition: transform 0.5s ease;">
                         <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px;">
                             <div style="color: rgba(255,255,255,0.7); font-weight: 600; font-size: 14px; margin-bottom: 2px; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">${displayYear}</div>
                             <h4 style="margin: 0; font-size: 20px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${event.eventName}</h4>
                             <p style="margin: 5px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${event.photos.length} Photos</p>
                         </div>
                    `;
                    socialGrid.appendChild(card);
                });
            }
            // 3. NSMOSA Events Public Grid
            const nsmosaGrid = document.getElementById('nsmosa-events-public-grid');
            if (nsmosaGrid) {
                const systemDefaults: EventPhoto[] = [
                    {
                        id: 'nsmosa-jubilee-default',
                        eventName: 'Golden Jubilee Celebrations',
                        category: 'nsmosa',
                        year: 2023,
                        eventDate: '2023-01-01',
                        photos: Array(60).fill({ url: '/images/golden%20jublee%20celebrations/golden%20jublee%20celebrations/Gen%20Sec%20report%202023-24-1.jpg', name: 'Jubilee 1' }),
                        createdAt: 0
                    }
                ];

                const nsmosaEvents = [
                    ...events.filter(e => e.category === 'nsmosa'),
                    ...systemDefaults.filter(d => !events.find(e => e.id === d.id))
                ];

                if (nsmosaEvents.length === 0) {
                    nsmosaGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
                        <p>No NSMOSA events found.</p>
                    </div>
                `;
                } else {
                    nsmosaGrid.innerHTML = '';
                    nsmosaEvents.sort((a, b) => b.year - a.year);

                    nsmosaEvents.forEach(event => {
                        const card = document.createElement('div');
                        card.onclick = () => (window as any).openAlbum(event.id, 'nsmosa-events-view');
                        card.className = 'year-box';
                        card.style.cssText = 'background: white; border-radius: 15px; position: relative; overflow: hidden; height: 200px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.3s ease; border: none;';
                        card.onmouseover = () => { card.style.transform = 'translateY(-5px)'; };
                        card.onmouseout = () => { card.style.transform = 'translateY(0)'; };

                        const coverImage = event.photos.length > 0 ? event.photos[0].url : '/images/placeholder.jpg';
                        card.innerHTML = `
                         <img src="${coverImage}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; transition: transform 0.5s ease;">
                         <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px;">
                             <div style="color: rgba(255,255,255,0.7); font-weight: 600; font-size: 14px; margin-bottom: 2px; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">${event.year}</div>
                             <h4 style="margin: 0; font-size: 20px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${event.eventName}</h4>
                             <p style="margin: 5px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">${event.photos.length} Photos</p>
                         </div>
                    `;
                        nsmosaGrid.appendChild(card);
                    });
                }
            }
        }
    } catch (e) {
        console.error('Error updating public page:', e);
    }
};

// Load admin galleries (unified view)
(window as any).loadAdminGalleries = async () => {
    const grid = document.getElementById('admin-all-galleries-grid');
    if (!grid) return;

    try {
        const events = await DB.getEvents();

        // Filter specifically for "gallery" category
        const galleryEvents = events.filter(e => e.category === 'gallery');

        galleryEvents.sort((a, b) => b.year - a.year);

        if (galleryEvents.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No galleries found. Click "Add New Gallery" to create one.</p>';
            return;
        }

        grid.innerHTML = galleryEvents.map(event => {
            const coverImage = event.photos.length > 0 ? event.photos[0].url : '';
            return `
                <div class="event-year-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); transition: transform 0.3s ease; border: 1px solid #eee; cursor: pointer;"
                    onclick="window.viewYearEvents('${event.category}', ${event.year}, '${event.id}')"
                    onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.12)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.08)'">
                    <div style="position: relative; aspect-ratio: 4/3; overflow: hidden; background: #f8fafc;">
                        ${coverImage
                    ? `<img src="${coverImage}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;"><i class="fas fa-image" style="color: #cbd5e1; font-size: 32px;"></i></div>`
                }
                        <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 8px;">
                            <button onclick="event.stopPropagation(); window.editEvent('${event.id}')" title="Edit Gallery" style="width: 32px; height: 32px; border-radius: 6px; background: white; border: none; color: #004e92; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="event.stopPropagation(); window.deleteEvent('${event.id}')" title="Delete Gallery" style="width: 32px; height: 32px; border-radius: 6px; background: white; border: none; color: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div style="padding: 15px; text-align: center;">
                        <h5 style="margin: 0 0 5px 0; font-size: 1.1rem; font-weight: 700; color: #00274d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${event.eventName}">${event.eventName}</h5>
                        <p style="margin: 0 0 10px 0; font-size: 0.9rem; font-weight: 600; color: #004e92;">${event.year}</p>
                        <span style="display: block; font-size: 0.85rem; color: #64748b;">${event.photos.length} Photos</span>
                    </div>
                </div>
            `;
        }).join('');

    } catch (e) {
        console.error('Error loading admin galleries:', e);
    }
};

// Open public album
(window as any).openAlbum = async (id: string, fromView?: string) => {
    const mainContainer = document.getElementById('main-events-container');
    const socialView = document.getElementById('social-years-view');
    const nsmosaView = document.getElementById('nsmosa-events-view');
    const galleryView = document.getElementById('public-gallery-view');

    // Set last view for back button
    (window as any).lastPublicView = fromView || 'main-events-container';

    if (mainContainer) mainContainer.style.display = 'none';
    if (socialView) socialView.style.display = 'none';
    if (nsmosaView) nsmosaView.style.display = 'none';
    if (galleryView) galleryView.style.display = 'block';

    const grid = document.getElementById('public-gallery-grid');
    const title = document.getElementById('public-gallery-title');
    const yearLabel = document.getElementById('public-gallery-year');

    if (grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

    try {
        const events = await DB.getEvents();
        let event = events.find(e => e.id === id);

        if (!event) {
            const systemDefaults: EventPhoto[] = [
                {
                    id: 'social-2024-default',
                    eventName: 'Annual General Body Meeting',
                    category: 'social',
                    year: 2024,
                    eventDate: '2024-01-01',
                    photos: Array(15).fill({ url: '/images/social-events/Gen%20Sec%20report%20PPT%202024-25-1.jpg', name: 'Slide 1' }),
                    createdAt: 0
                },
                {
                    id: 'nsmosa-jubilee-default',
                    eventName: 'Golden Jubilee Celebrations',
                    category: 'nsmosa',
                    year: 2023,
                    eventDate: '2023-01-01',
                    photos: Array(60).fill({ url: '/images/golden%20jublee%20celebrations/golden%20jublee%20celebrations/Gen%20Sec%20report%202023-24-1.jpg', name: 'Jubilee 1' }),
                    createdAt: 0
                }
            ];
            event = systemDefaults.find(e => e.id === id);
        }

        if (event) {
            if (title) title.textContent = event.eventName;
            if (yearLabel) yearLabel.textContent = event.year.toString();
            if (grid) {
                grid.innerHTML = event.photos.map(p => `
                    <div class="gallery-image-wrapper" onclick="window.openLightbox('${p.url}')" style="border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.3s ease; height: 250px;">
                        <img src="${p.url}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                `).join('');
            }
        } else {
            if (grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;">Event not found.</div>';
        }
    } catch (e) {
        console.error('Error opening album:', e);
    }
};
// ==========================================
// Video Management Logic
// ==========================================

(window as any).openCreateVideoModal = () => {
    const modal = document.getElementById('create-video-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};

(window as any).closeCreateVideoModal = () => {
    const modal = document.getElementById('create-video-modal');
    const form = document.getElementById('create-video-form') as HTMLFormElement;
    const previewContainer = document.getElementById('video-preview-container');

    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (form) form.reset();
    if (previewContainer) previewContainer.style.display = 'none';

    uploadedVideoBlob = null;
};

(window as any).initVideoUploadListener = () => {
    const videoFileInput = document.getElementById('video-file-input') as HTMLInputElement;
    if (videoFileInput) {
        videoFileInput.addEventListener('change', function (e: any) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 50 * 1024 * 1024) {
                    alert("Warning: Large files might crash the browser storage. Please try smaller clips.");
                }

                uploadedVideoBlob = file;

                const previewContainer = document.getElementById('video-preview-container');
                const fileNameDisplay = document.getElementById('video-file-name');
                const videoPreview = document.getElementById('video-upload-preview') as HTMLVideoElement;

                if (previewContainer) previewContainer.style.display = 'block';
                if (fileNameDisplay) fileNameDisplay.textContent = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;

                if (videoPreview) {
                    const fileUrl = URL.createObjectURL(file);
                    videoPreview.src = fileUrl;
                    videoPreview.load();
                }
            }
        });
    }

    const createVideoForm = document.getElementById('create-video-form');
    if (createVideoForm) {
        createVideoForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const eventNameEl = document.getElementById('video-event-name') as HTMLInputElement;
            const nameEl = document.getElementById('video-name') as HTMLInputElement;
            const yearEl = document.getElementById('video-year') as HTMLInputElement;
            const saveBtn = document.getElementById('save-video-btn');

            if (!eventNameEl?.value || !nameEl?.value || !yearEl?.value || !uploadedVideoBlob) {
                alert("Please fill all fields and upload a video.");
                return;
            }

            if (saveBtn) {
                saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
                (saveBtn as any).disabled = true;
            }

            try {
                const newVideo: any = {
                    id: Date.now().toString(),
                    eventName: eventNameEl.value,
                    name: nameEl.value,
                    year: yearEl.value,
                    blob: uploadedVideoBlob,
                    type: (uploadedVideoBlob as any).type,
                    createdAt: Date.now()
                };

                await DB.saveVideo(newVideo);
                alert("Video uploaded successfully!");
                (window as any).closeCreateVideoModal();
                (window as any).loadVideos();
            } catch (err) {
                console.error("Error saving video:", err);
                alert("Failed to save video. It might be too large for browser storage.");
            } finally {
                if (saveBtn) {
                    saveBtn.innerHTML = '<i class="fas fa-check"></i> Upload Video';
                    (saveBtn as any).disabled = false;
                }
            }
        });
    }
};

(window as any).deleteVideo = async (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
        await DB.deleteVideo(id);
        (window as any).loadVideos();
    }
};

(window as any).loadVideos = async () => {
    try {
        const videos = await DB.getVideos();
        videos.sort((a, b) => b.createdAt - a.createdAt);

        // 1. Admin Dashboard View
        const adminVideoContainer = document.getElementById('admin-video-list-container');
        if (adminVideoContainer) {
            if (videos.length > 0) {
                let html = '<div class="gallery-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; width: 100%;">';

                videos.forEach(video => {
                    const videoBlob = video.blob instanceof Blob ? video.blob : new Blob([], { type: video.type || 'video/mp4' });
                    const videoUrl = URL.createObjectURL(videoBlob);
                    html += `
                        <div class="event-year-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); transition: transform 0.3s ease; border: 1px solid #eee; position: relative;">
                            <div style="position: relative; aspect-ratio: 4/3; overflow: hidden; background: #000;">
                                <video src="${videoUrl}" style="width: 100%; height: 100%; object-fit: cover;"></video>
                                <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 8px;">
                                    <button onclick="event.stopPropagation(); alert('Edit video functionality coming soon')" title="Edit Video" style="width: 32px; height: 32px; border-radius: 6px; background: white; border: none; color: #004e92; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="event.stopPropagation(); window.deleteVideo('${video.id}')" title="Delete Video" style="width: 32px; height: 32px; border-radius: 6px; background: white; border: none; color: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; pointer-events: none;">
                                    <i class="fas fa-play-circle" style="color: white; font-size: 48px; opacity: 0.8;"></i>
                                </div>
                            </div>
                            <div style="padding: 15px; text-align: center;">
                                <h5 style="margin: 0 0 5px 0; font-size: 1.1rem; font-weight: 700; color: #00274d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${video.eventName}">${video.eventName}</h5>
                                <p style="margin: 0 0 10px 0; font-size: 0.9rem; font-weight: 600; color: #004e92;">${video.year}</p>
                                <span style="display: block; font-size: 0.85rem; color: #64748b;">${video.name}</span>
                            </div>
                        </div>
                    `;
                });

                html += '</div>';
                adminVideoContainer.innerHTML = html;
                adminVideoContainer.style.display = 'block';
            } else {
                adminVideoContainer.innerHTML = `
                    <div class="admin-placeholder-content">
                        <i class="fas fa-video" style="font-size: 80px; color: var(--loyola-blue); opacity: 0.1; margin-bottom: 25px;"></i>
                        <h4 style="font-size: 28px; color: var(--loyola-blue); font-weight: 700;">No Videos Found</h4>
                        <p style="color: #64748b; font-size: 16px; margin-bottom: 30px; max-width: 450px;">Upload and organize alumni videos, event highlights, and memories to share with the community.</p>
                        <button class="btn-primary-admin" onclick="window.openCreateVideoModal()" style="padding: 15px 40px; font-size: 16px; box-shadow: 0 10px 25px rgba(0,78,146,0.2);">
                            <i class="fas fa-plus-circle" style="margin-right: 10px;"></i> Add First Video
                        </button>
                    </div>
                `;
                adminVideoContainer.style.display = 'block';
            }
        }

        // 2. Public Video Gallery View
        const publicVideoGrid = document.getElementById('videos-direct-grid');
        if (publicVideoGrid) {
            publicVideoGrid.innerHTML = '';
            if (videos.length > 0) {
                videos.forEach(video => {
                    const videoBlob = video.blob instanceof Blob ? video.blob : new Blob([], { type: video.type || 'video/mp4' });
                    const videoUrl = URL.createObjectURL(videoBlob);

                    const vidDiv = document.createElement('div');
                    vidDiv.className = 'video-item';
                    vidDiv.innerHTML = `
                        <div class="video-wrapper">
                            <video controls preload="metadata">
                                <source src="${videoUrl}" type="${video.type || 'video/mp4'}">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="video-info">
                            <h4>${video.eventName}</h4>
                            <p>${video.year} • ${video.name}</p>
                        </div>
                    `;
                    publicVideoGrid.appendChild(vidDiv);
                });
            } else {
                publicVideoGrid.innerHTML = '<p style="text-align:center; width:100%; color:#666;">No videos uploaded yet.</p>';
            }
        }
    } catch (e) {
        console.error("Error loading videos:", e);
    }
};

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    (window as any).initVideoUploadListener();
    (window as any).loadVideos();
});
