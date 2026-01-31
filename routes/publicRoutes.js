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

router.get('/events', (req, res) => {
    res.redirect('/alumni-events');
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
    res.render('about', { path: '/reunion-about' });
});

router.get('/reunion-gallery', (req, res) => {
    res.render('gallery', { gallery: [], path: '/reunion-gallery' });
});

router.get('/video-gallery', (req, res) => {
    res.render('gallery', { gallery: [], path: '/video-gallery' });
});


router.get('/donate', (req, res) => {
    res.render('donation-form', { path: '/donate' });
});

router.post('/process-donation', (req, res) => {
    // Placeholder for payment processing logic
    // In a real app, this would integrate with a payment gateway (Razorpay, Stripe, etc.)
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #0A2040;">Thank You for Your Generosity!</h1>
            <p>This is a simulated payment page.</p>
            <p><strong>Name:</strong> ${req.body.name}</p>
            <p><strong>Amount:</strong> ₹${req.body.amount}</p>
            <p><strong>Type:</strong> ${req.body.donationType}</p>
            <br>
            <a href="/" style="background: #0A2040; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Return Home</a>
        </div>
    `);
});

module.exports = router;
