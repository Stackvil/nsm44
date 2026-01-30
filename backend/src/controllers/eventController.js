const { getDatabase } = require('../config/db');

const EventController = {
    // 1. Create Event
    async createEvent(req, res) {
        const { title, description, date, image_url } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!title || !date) {
            return res.status(400).json({ error: 'Title and Date are required' });
        }

        // Auto-approve if created by Admin/Super Admin
        // Rep Admin -> Pending
        const initialStatus = (userRole === 'admin' || userRole === 'super_admin') ? 'approved' : 'pending';

        const db = getDatabase();
        try {
            const result = await db.run(
                `INSERT INTO events (title, description, date, image_url, status, created_by) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [title, description, date, image_url, initialStatus, userId]
            );

            res.status(201).json({
                message: 'Event created successfully',
                eventId: result.lastID,
                status: initialStatus
            });
        } catch (err) {
            console.error('Create Event Error:', err);
            res.status(500).json({ error: 'Failed to create event' });
        }
    },

    // 2. Get Events
    async getEvents(req, res) {
        const db = getDatabase();
        const userRole = req.user ? req.user.role : null;
        const userId = req.user ? req.user.id : null;

        try {
            let query = 'SELECT events.*, users.name as creator_name FROM events LEFT JOIN users ON events.created_by = users.id';
            let params = [];

            // Filter logic:
            // - Public (No Auth) or Regular User: Only 'approved'
            // - Rep Admin: 'approved' + their own 'pending'/'rejected' events
            // - Admin/Super Admin: ALL events (for moderation)

            if (!userRole || userRole === 'user') {
                query += " WHERE status = 'approved'";
            } else if (userRole === 'rep_admin') {
                query += " WHERE status = 'approved' OR created_by = ?";
                params.push(userId);
            }
            // Admin/Super Admin see all by default (no WHERE clause needed)

            query += " ORDER BY date DESC";

            const events = await db.all(query, params);
            res.json(events);
        } catch (err) {
            console.error('Get Events Error:', err);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    },

    // 3. Approve/Reject Event (Admin Only)
    async updateEventStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const db = getDatabase();
        try {
            await db.run('UPDATE events SET status = ? WHERE id = ?', [status, id]);
            res.json({ message: `Event status updated to ${status}` });
        } catch (err) {
            console.error('Update Status Error:', err);
            res.status(500).json({ error: 'Failed to update event status' });
        }
    },

    // 4. Delete Event
    async deleteEvent(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const db = getDatabase();

        // Check ownership if Rep Admin
        if (userRole === 'rep_admin') {
            const event = await db.get('SELECT created_by FROM events WHERE id = ?', [id]);
            if (!event) return res.status(404).json({ error: 'Event not found' });

            if (event.created_by !== userId) {
                return res.status(403).json({ error: 'You can only delete your own events' });
            }
        }

        try {
            await db.run('DELETE FROM events WHERE id = ?', [id]);
            res.json({ message: 'Event deleted successfully' });
        } catch (err) {
            console.error('Delete Event Error:', err);
            res.status(500).json({ error: 'Failed to delete event' });
        }
    }
};

module.exports = EventController;
