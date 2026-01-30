const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

router.get('/', async (req, res) => {
    try {
        const gallery = await Content.findAll({ where: { section: 'home', isVisible: true } });
        res.render('home', { gallery });
    } catch (err) {
        console.error(err);
        res.render('home', { gallery: [] });
    }
});

module.exports = router;
