const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Content = require('../models/Content');
const { ensureAuthenticated, ensureRole, preventCache } = require('../middleware/auth');

// Change Password Page
router.get('/change-password', ensureAuthenticated, (req, res) => {
    res.render('admin/change-password', { user: req.session.user });
});

// Change Password Action
router.post('/change-password', ensureAuthenticated, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        req.flash('error_msg', 'New passwords do not match');
        return res.redirect('/admin/change-password');
    }

    try {
        const user = await User.findByPk(req.session.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            req.flash('error_msg', 'Current password is incorrect');
            return res.redirect('/admin/change-password');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        req.flash('success_msg', 'Password updated successfully!');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred');
        res.redirect('/admin/change-password');
    }
});

// Dashboard - View Data based on Role
// Dashboard - View Data based on Role
router.get('/dashboard', ensureAuthenticated, preventCache, async (req, res) => {
    try {
        const totalMembers = await User.count({ where: { role: 'user' } });
        const pendingApproval = await Content.count({ where: { status: 'pending' } });
        const totalCollections = 15000; // Mock value for now

        // Handle sub-section display
        const section = req.query.section || 'nsmosa_events';

        // Get session uploaded images
        const uploadedSessionImages = req.session.uploadedSessionImages || [];

        res.render('admin/dashboard', {
            user: req.session.user,
            totalMembers,
            pendingApproval,
            totalCollections,
            section,
            uploadedSessionImages, // Pass the session images
            page: 'home' // For sidebar highlighting
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Create Content Page
router.get('/create', ensureAuthenticated, (req, res) => {
    if (req.session.user.role === 'user') return res.redirect('/');
    res.render('admin/create');
});

// Home Settings Page
router.get('/home-settings', ensureAuthenticated, (req, res) => {
    if (req.session.user.role === 'user') return res.redirect('/');
    res.render('admin/home-settings', { user: req.session.user });
});

// Create Content Action
const upload = require('../utils/fileUpload');

// Create Content Action
router.post('/create', ensureAuthenticated, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            req.flash('error_msg', err);
            return res.redirect('/admin/dashboard');
        }

        const { title, description, imageUrl: bodyImageUrl, section } = req.body;
        let imageUrl = bodyImageUrl;

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const status = (req.session.user.role === 'admin' || req.session.user.role === 'super_admin') ? 'approved' : 'pending';

        try {
            const newContent = await Content.create({
                title,
                description,
                imageUrl,
                section,
                status,
                createdBy: req.session.user.id
            });

            // Store in session for "Recently Uploaded" display
            if (!req.session.uploadedSessionImages) {
                req.session.uploadedSessionImages = [];
            }
            req.session.uploadedSessionImages.unshift({
                id: newContent.id,
                title: newContent.title,
                imageUrl: newContent.imageUrl,
                section: newContent.section
            });

            req.flash('success_msg', status === 'pending' ? 'Content submitted for verification' : 'Content published successfully');
        } catch (error) {
            console.error(error);
            req.flash('error_msg', 'Error creating content');
        }
        res.redirect(`/admin/dashboard?section=${section}`);
    });
});

// Edit Content Page (Admin/Super Admin only for "Update")
router.get('/edit/:id', ensureAuthenticated, ensureRole(['admin', 'super_admin']), async (req, res) => {
    const content = await Content.findByPk(req.params.id);
    res.render('admin/edit', { content });
});

// Update Content Action (The "Update" part of the request)
router.post('/edit/:id', ensureAuthenticated, ensureRole(['admin', 'super_admin']), async (req, res) => {
    const { title, description, imageUrl, section, status } = req.body;
    await Content.update({ title, description, imageUrl, section, status }, { where: { id: req.params.id } });
    req.flash('success_msg', 'Content updated successfully');
    res.redirect('/admin/dashboard');
});

// Verify/Approve Action
router.post('/approve/:id', ensureAuthenticated, ensureRole(['admin', 'super_admin']), async (req, res) => {
    try {
        await Content.update({ status: 'approved' }, { where: { id: req.params.id } });
        req.flash('success_msg', 'Content verified and is now visible to members');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Verification failed');
        res.redirect('/admin/dashboard');
    }
});

// Member Management Page
router.get('/members', ensureAuthenticated, ensureRole(['admin', 'super_admin', 'rep_admin']), async (req, res) => {
    try {
        const members = await User.findAll({
            order: [['createdAt', 'DESC']]
        });

        const totalMembers = await User.count({ where: { role: 'user' } });
        const pendingApproval = await Content.count({ where: { status: 'pending' } });
        const totalCollections = 15000;

        res.render('admin/dashboard', {
            user: req.session.user,
            page: 'members',
            section: null,
            uploadedSessionImages: [],
            members,
            totalMembers,
            pendingApproval,
            totalCollections
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard');
    }
});

const multiUpload = require('../utils/multiFileUpload');

// NSMOSA Events Management Page
router.get('/nsmosa-events', ensureAuthenticated, ensureRole(['admin', 'super_admin', 'rep_admin']), async (req, res) => {
    const type = req.query.type; // 'social_events' or 'nsmosa_events'

    try {
        const totalMembers = await User.count({ where: { role: 'user' } });
        const pendingApproval = await Content.count({ where: { status: 'pending' } });
        const totalCollections = 15000;

        let events = [];
        if (type) {
            // Fetch content for this section
            const rawContent = await Content.findAll({
                where: { section: type },
                order: [['createdAt', 'DESC']]
            });

            // Group by Title + Year to simulate "Event Albums"
            const grouped = {};
            rawContent.forEach(item => {
                const key = `${item.title}-${item.year}`;
                if (!grouped[key]) {
                    grouped[key] = {
                        title: item.title,
                        year: item.year,
                        images: [],
                        id: item.id // use first id as ref
                    };
                }
                grouped[key].images.push(item);
            });
            events = Object.values(grouped);
        }

        res.render('admin/dashboard', {
            user: req.session.user,
            page: 'nsmosa_events',
            section: null, // sub-section of dashboard
            uploadedSessionImages: [],
            events,
            eventType: type,
            totalMembers,
            pendingApproval,
            totalCollections,
            uploadedSessionEvents: req.session.uploadedEvents || []
        });

    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard');
    }
});

// Create Event Action
router.post('/create-event', ensureAuthenticated, (req, res) => {
    multiUpload(req, res, async (err) => {
        if (err) {
            req.flash('error_msg', err);
            return res.redirect('/admin/nsmosa-events');
        }

        const { eventName, eventYear, eventType } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            req.flash('error_msg', 'Please upload at least one image');
            return res.redirect(`/admin/nsmosa-events?type=${eventType}`);
        }

        try {
            const createdItems = [];
            for (const file of files) {
                const imageUrl = `/uploads/${file.filename}`;
                const newContent = await Content.create({
                    title: eventName,
                    year: eventYear,
                    section: eventType,
                    imageUrl: imageUrl,
                    description: `Event: ${eventName}, Year: ${eventYear}`,
                    status: 'approved', // Auto approve for simplicity or based on role
                    createdBy: req.session.user.id
                });
                createdItems.push(newContent);
            }

            // Store in session for immediate display (grouped)
            if (!req.session.uploadedEvents) {
                req.session.uploadedEvents = [];
            }
            // Add as a single event object to session
            req.session.uploadedEvents.unshift({
                title: eventName,
                year: eventYear,
                type: eventType,
                coverImage: `/uploads/${files[0].filename}`,
                count: files.length
            });

            req.flash('success_msg', 'Event created and images uploaded successfully!');
            res.redirect(`/admin/nsmosa-events?type=${eventType}`);

        } catch (error) {
            console.error(error);
            req.flash('error_msg', 'Error creating event');
            res.redirect(`/admin/nsmosa-events?type=${eventType}`);
        }
    });
});

// Delete Event (Grouped)
router.post('/delete-event', ensureAuthenticated, ensureRole(['admin', 'super_admin']), async (req, res) => {
    const { title, year, section } = req.body;
    try {
        await Content.destroy({
            where: {
                title: title,
                year: year,
                section: section
            }
        });
        // Also remove from session if present
        if (req.session.uploadedEvents) {
            req.session.uploadedEvents = req.session.uploadedEvents.filter(e => !(e.title === title && e.year == year && e.type === section));
        }
        req.flash('success_msg', 'Event deleted successfully');
        res.redirect(`/admin/nsmosa-events?type=${section}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete event');
        res.redirect(`/admin/nsmosa-events?type=${section}`);
    }
});

// Edit Event (Renaming)
router.post('/update-event', ensureAuthenticated, ensureRole(['admin', 'super_admin']), async (req, res) => {
    const { originalTitle, originalYear, newTitle, newYear, section } = req.body;
    try {
        await Content.update({
            title: newTitle,
            year: newYear
        }, {
            where: {
                title: originalTitle,
                year: originalYear,
                section: section
            }
        });
        req.flash('success_msg', 'Event updated successfully');
        res.redirect(`/admin/nsmosa-events?type=${section}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to update event');
        res.redirect(`/admin/nsmosa-events?type=${section}`);
    }
});

// Update User Role Action
router.post('/update-role', ensureAuthenticated, ensureRole(['admin', 'super_admin']), async (req, res) => {
    const { userId, newRole } = req.body;

    // Prevent self-demotion or critical role changes if needed, 
    // but for now allow logged in admin/super_admin to change others.

    try {
        await User.update({ role: newRole }, { where: { id: userId } });
        req.flash('success_msg', 'User role updated successfully');
        res.redirect('/admin/members');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to update role');
        res.redirect('/admin/members');
    }
});

// Delete Content Action
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    if (req.session.user.role === 'user') return res.redirect('/');

    try {
        const content = await Content.findByPk(req.params.id);
        if (content) {
            const section = content.section;
            await content.destroy();

            // Remove from session if exists
            if (req.session.uploadedSessionImages) {
                req.session.uploadedSessionImages = req.session.uploadedSessionImages.filter(img => img.id != req.params.id);
            }

            req.flash('success_msg', 'Content deleted successfully');
            res.redirect(`/admin/dashboard?section=${section}`);
        } else {
            req.flash('error_msg', 'Content not found');
            res.redirect('/admin/dashboard');
        }
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting content');
        res.redirect('/admin/dashboard');
    }
});

module.exports = router;
