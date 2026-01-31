const express = require('express');
const router = express.Router();
const Content = require('../models/Content');


router.get('/', async (req, res) => {
    try {
        const gallery = await Content.findAll({ where: { section: 'home', isVisible: true } });
        res.render('home', { gallery, path: '/' });
    } catch (err) {
        console.error(err);
        res.render('home', { gallery: [], path: '/' });
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
        const gallery = await Content.findAll({ where: { isVisible: true } });
        res.render('gallery', { gallery, path: '/gallery' });
    } catch (err) {
        res.render('gallery', { gallery: [], path: '/gallery' });
    }
});

router.get('/alumni-chapter', (req, res) => {
    res.render('chapter', { path: '/alumni-chapter' });
});

router.get('/alumni-chapters', (req, res) => {
    res.redirect('/alumni-chapter');
});

router.get('/alumni-events', (req, res) => {
    res.render('alumni-events', { path: '/alumni-events' });
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

router.get('/executive-committee', (req, res) => {
    res.render('executive-committee', { path: '/executive-committee' });
});

router.get('/alumni-benefits', (req, res) => {
    res.render('alumni-benefits', { path: '/alumni-benefits' });
});

router.get('/annual-reports', (req, res) => {
    res.render('annual-reports', { path: '/annual-reports' });
});

// Alumni Connect Placeholders
router.get('/my-profile', (req, res) => {
    res.render('my-profile', { path: '/my-profile' });
});

router.get('/how-to-give', (req, res) => {
    res.render('how-to-give', { path: '/how-to-give' });
});

router.get('/connect-with-us', (req, res) => {
    res.redirect('/contact');
});

router.get('/alumni-directory', (req, res) => {
    res.render('alumni-directory', { path: '/alumni-directory' });
});

router.get('/business-directory', (req, res) => {
    res.render('business-directory', { path: '/business-directory' });
});

router.get('/reunion', (req, res) => {
    res.render('events', { path: '/reunion' });
});

router.get('/reunion-about', (req, res) => {
    res.render('reunion-about', { path: '/reunion-about' });
});

router.get('/reunion-gallery', (req, res) => {
    res.render('reunion-gallery', { gallery: [], path: '/reunion-gallery' });
});

router.get('/video-gallery', (req, res) => {
    res.render('video-gallery', { gallery: [], path: '/video-gallery' });
});

module.exports = router;
