const API_URL = 'http://localhost:5001/api';

/**
 * Generic API Helper
 */
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = sessionStorage.getItem('auth_token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'API Error');
        return result;
    } catch (err) {
        console.error(`API Call Failed [${endpoint}]:`, err);
        throw err;
    }
}

/**
 * 1. Override Login Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Clone to remove existing listeners
        const newLoginForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newLoginForm, loginForm);

        newLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value; // Need to ensure input exists

            try {
                const data = await apiCall('/auth/login', 'POST', { email, password });

                // Store Session
                sessionStorage.setItem('auth_token', data.token);
                sessionStorage.setItem('nsm_user_role', data.user.role);
                sessionStorage.setItem('nsm_user_name', data.user.name);
                sessionStorage.setItem('nsm_user_email', data.user.email);
                sessionStorage.setItem('nsm_is_logged_in', 'true');

                // Also update LocalStorage for persistence across tabs if needed (optional)
                localStorage.setItem('nsm_user_role', data.user.role);

                alert(`Login Successful! Welcome ${data.user.name}`);

                // Close modal and Update UI
                if (window.closeLoginModal) window.closeLoginModal();
                if (typeof window.updateRoleUI === 'function') window.updateRoleUI();
                if (typeof window.handleLoginSuccess === 'function') window.handleLoginSuccess();

                location.reload();
            } catch (err) {
                alert(err.message);
            }
        });
    }
});

/**
 * 2. Override Event Rendering
 */
window.renderAlumniEvents = async function () {
    const eventsContainer = document.querySelector('#alumni-event-connect-section .events-grid');
    if (!eventsContainer) return;

    try {
        const events = await apiCall('/events', 'GET');

        if (events.length > 0) {
            eventsContainer.innerHTML = '';
            events.forEach(event => {
                const dateObj = new Date(event.date);
                const day = dateObj.getDate().toString().padStart(2, '0');
                const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
                const imageSrc = event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=90&auto=format&fit=crop';

                const eventCard = `
             <div class="event-card">
               <div class="event-image-wrapper">
                 <img src="${imageSrc}" alt="${event.title}" class="event-image" />
                 <div class="event-date-badge">
                   <span class="event-day">${day}</span>
                   <span class="event-month">${month}</span>
                 </div>
               </div>
               <div class="event-content">
                 <h4 class="event-title">${event.title}</h4>
                 <p class="event-time"><i class="fas fa-clock"></i> 10:00 AM</p> <!-- Static Time for now -->
                 <p class="event-description">${event.description}</p>
                 <a href="#" class="event-btn">Register Now</a>
               </div>
             </div>
           `;
                eventsContainer.insertAdjacentHTML('beforeend', eventCard);
            });
        } else {
            eventsContainer.innerHTML = '<p>No approved events found.</p>';
        }
    } catch (err) {
        console.error('Failed to load events', err);
        // Fallback to local logic or empty
    }
};
