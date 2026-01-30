const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Public/Shared Access
// Note: We use authenticateToken strictly for 'rep_admin' filtering in getEvents. 
// If public access is needed without login, we might need a separate endpoint or optional auth middleware.
// For now, let's assume getEvents is open but checks header if present? 
// No, current middleware enforces token.
// Let's make a decision: 
// Public View: /api/events/public (No Auth, Approved only)
// Admin/Rep View: /api/events (Auth Required)

// ...Actually, standard practice is to use one endpoint with optional auth or explicit Public endpoint.
// Let's keep it simple: Protected endpoint for management. 
// Public endpoint for the website gallery.

// 1. Get Events (Protected - for Dashboard/Rep View)
router.get('/', authenticateToken, EventController.getEvents);

// 2. Create Event (Rep Admin, Admin, Super Admin)
router.post('/', authenticateToken, authorizeRole(['rep_admin', 'admin', 'super_admin']), EventController.createEvent);

// 3. Approve/Reject Status (Admin, Super Admin)
router.put('/:id/status', authenticateToken, authorizeRole(['admin', 'super_admin']), EventController.updateEventStatus);

// 4. Delete Event (Rep Admin, Admin, Super Admin)
router.delete('/:id', authenticateToken, authorizeRole(['rep_admin', 'admin', 'super_admin']), EventController.deleteEvent);

// 5. Public Events (Optional - for frontend public page)
// We can expose a separate route that doesn't use auth middleware
router.get('/public', async (req, res) => {
    // Manually call controller logic or create a specific public wrapper
    // For simplicity, reusing controller might error if it expects req.user
    // So let's just make a quick inline handler or update controller to handle no-auth

    // Let's rely on the controller's robust logic but mock the user as null?
    // No, middleware blocks it.
    // Solution: Create a specific logic here or bypass middleware.

    const { getDatabase } = require('../config/db');
    const db = getDatabase();
    try {
        const events = await db.all("SELECT * FROM events WHERE status = 'approved' ORDER BY date DESC");
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch public events' });
    }
});

module.exports = router;
