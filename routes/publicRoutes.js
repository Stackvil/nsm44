const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const User = require('../models/User');
const { ensureAuthenticated, preventCache } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

router.get('/', async (req, res) => {
    try {
        // Fetch specific sections
        const homeEvents = await Content.findAll({ where: { section: 'home_nsmosa_events', isVisible: true }, order: [['createdAt', 'DESC']] });
        const homeMiddle = await Content.findAll({ where: { section: 'home_middle_box', isVisible: true }, order: [['createdAt', 'DESC']] });
        const homeGallery = await Content.findAll({ where: { section: 'home_photo_gallery', isVisible: true }, order: [['createdAt', 'DESC']] });

        // Fallback or legacy content
        const legacyGallery = await Content.findAll({ where: { section: 'home', isVisible: true } });

        res.render('home', {
            gallery: legacyGallery, // Keep compatible if needed
            homeEvents,
            homeMiddle,
            homeGallery,
            path: '/'
        });
    } catch (err) {
        console.error(err);
        res.render('home', { gallery: [], homeEvents: [], homeMiddle: [], homeGallery: [], path: '/' });
    }
});

router.get('/about', (req, res) => {
    res.render('about', { path: '/about' });
});

router.get('/contact', (req, res) => {
    res.render('contact', { path: '/contact' });
});

router.get('/faq', (req, res) => {
    res.render('faq', { path: '/faq' });
});

router.get('/gallery', async (req, res) => {
    try {
        const gallery = await Content.findAll({
            where: {
                section: 'photo_gallery',
                isVisible: true
            },
            order: [['createdAt', 'DESC']]
        });
        res.render('gallery', { gallery, path: '/gallery' });
    } catch (err) {
        console.error('Error fetching photo gallery:', err);
        res.render('gallery', { gallery: [], path: '/gallery' });
    }
});

router.get('/alumni-chapter', (req, res) => {
    res.render('chapter', { path: '/alumni-chapter' });
});

router.get('/alumni-chapters', (req, res) => {
    res.redirect('/alumni-chapter');
});

router.get('/alumni-events', ensureAuthenticated, async (req, res) => {
    try {
        const rawEvents = await Content.findAll({
            where: {
                section: 'alumni_events',
                isVisible: true
            },
            order: [['eventDate', 'DESC'], ['createdAt', 'DESC']]
        });

        // Group by Title + Year
        const grouped = {};
        rawEvents.forEach(item => {
            const key = `${item.title}-${item.year}`;
            if (!grouped[key]) {
                grouped[key] = {
                    title: item.title,
                    year: item.year,
                    location: item.location,
                    timing: item.timing,
                    eventDate: item.eventDate,
                    description: item.description,
                    images: []
                };
            }
            if (item.imageUrl) {
                grouped[key].images.push(item.imageUrl);
            }
        });

        const events = Object.values(grouped);
        res.render('alumni-events', { events, path: '/alumni-events' });
    } catch (err) {
        console.error('Error fetching alumni events:', err);
        res.render('alumni-events', { events: [], path: '/alumni-events' });
    }
});

router.get('/events', async (req, res) => {
    try {
        // Fetch all visible content. The frontend will filter by section/category.
        const events = await Content.findAll({
            where: { isVisible: true },
            order: [['year', 'DESC'], ['createdAt', 'DESC']]
        });
        res.render('events', { events, path: '/events' });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.render('events', { events: [], path: '/events' });
    }
});

// New Placeholders
router.get('/presidents-message', (req, res) => {
    res.render('presidents-message', { path: '/presidents-message' });
});

router.get('/executive-committee', async (req, res) => {
    try {
        const members = await Content.findAll({
            where: {
                section: 'executive_committee',
                isVisible: true
            },
            order: [['createdAt', 'ASC']] // Usually you want specific ordering, maybe add an 'order' field later? For now ASC creation might mimic insertion order.
        });
        res.render('executive-committee', { members, path: '/executive-committee' });
    } catch (err) {
        console.error('Error fetching executive committee:', err);
        res.render('executive-committee', { members: [], path: '/executive-committee' });
    }
});

router.get('/alumni-benefits', (req, res) => {
    res.render('alumni-benefits', { path: '/alumni-benefits' });
});

router.get('/annual-reports', (req, res) => {
    res.render('annual-reports', { path: '/annual-reports' });
});

// Alumni Connect Placeholders
router.get('/my-profile', ensureAuthenticated, preventCache, (req, res) => {
    res.render('my-profile', { path: '/my-profile', user: req.session.user });
});

router.post('/update-profile', ensureAuthenticated, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            req.flash('error_msg', err);
            return res.redirect('/my-profile');
        }

        const { fullName, phone, graduationYear, batch } = req.body;
        try {
            const user = await User.findByPk(req.session.user.id);
            if (!user) {
                req.flash('error_msg', 'User not found');
                return res.redirect('/my-profile');
            }

            user.fullName = fullName || user.fullName;
            user.phone = phone || user.phone;
            user.graduationYear = graduationYear || user.graduationYear;
            user.batch = batch || user.batch;

            if (req.file) {
                user.profileImage = `/uploads/${req.file.filename}`;
            }

            await user.save();

            // Update session
            req.session.user = {
                ...req.session.user,
                fullName: user.fullName,
                phone: user.phone,
                graduationYear: user.graduationYear,
                batch: user.batch,
                profileImage: user.profileImage
            };

            req.flash('success_msg', 'Profile updated successfully');
            res.redirect('/my-profile');
        } catch (err) {
            console.error('Error updating profile:', err);
            req.flash('error_msg', 'Failed to update profile');
            res.redirect('/my-profile');
        }
    });
});

router.get('/how-to-give', (req, res) => {
    res.render('how-to-give', { path: '/how-to-give' });
});

router.get('/connect-with-us', (req, res) => {
    res.redirect('/contact');
});

router.get('/alumni-directory', ensureAuthenticated, async (req, res) => {
    try {
        const alumni = await Content.findAll({
            where: {
                section: 'alumni_directory',
                isVisible: true
            },
            order: [['title', 'ASC']] // Alphabetical order usually corresponds better for directories
        });
        res.render('alumni-directory', { alumni, path: '/alumni-directory' });
    } catch (err) {
        console.error('Error fetching alumni directory:', err);
        res.render('alumni-directory', { alumni: [], path: '/alumni-directory' });
    }
});

router.get('/business-directory', ensureAuthenticated, async (req, res) => {
    try {
        const businesses = await Content.findAll({
            where: {
                section: 'business_directory',
                isVisible: true
            },
            order: [['createdAt', 'DESC']]
        });
        res.render('business-directory', { businesses, path: '/business-directory' });
    } catch (err) {
        console.error('Error fetching business directory:', err);
        res.render('business-directory', { businesses: [], path: '/business-directory' });
    }
});

router.get('/reunion', (req, res) => {
    res.render('events', { path: '/reunion' });
});

router.get('/reunion-about', (req, res) => {
    res.render('reunion-about', { path: '/reunion-about' });
});

router.get('/reunion-gallery', async (req, res) => {
    try {
        const gallery = await Content.findAll({
            where: {
                section: 'reunion_gallery',
                isVisible: true
            },
            order: [['createdAt', 'DESC']]
        });
        res.render('reunion-gallery', { gallery, path: '/reunion-gallery' });
    } catch (err) {
        console.error('Error fetching reunion gallery:', err);
        res.render('reunion-gallery', { gallery: [], path: '/reunion-gallery' });
    }
});

router.get('/video-gallery', (req, res) => {
    res.render('video-gallery', { gallery: [], path: '/video-gallery' });
});

router.get('/donate', (req, res) => {
    // Preserve query parameters (e.g., ?type=scholarship)
    const queryString = req.url.indexOf('?') !== -1 ? req.url.substring(req.url.indexOf('?')) : '';
    res.redirect('/payment/checkout' + queryString);
});

module.exports = router;
