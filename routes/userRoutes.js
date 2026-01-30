const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { ensureAuthenticated } = require('../middleware/auth');

// User Dashboard - Only see Approved Content
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        // User must be active to see dashboard
        if (!req.session.user.isActive && req.session.user.role === 'user') {
            req.flash('error_msg', 'Your account is pending verification.');
            return res.redirect('/auth/login');
        }

        const contents = await Content.findAll({
            where: { status: 'approved' },
            order: [['createdAt', 'DESC']]
        });

        res.render('user/dashboard', { contents, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;
