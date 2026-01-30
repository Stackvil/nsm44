const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            req.flash('error_msg', 'Username not found');
            return res.redirect('/auth/login');
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.user = { id: user.id, username: user.username, role: user.role };
            req.flash('success_msg', 'Logged in successfully');
            res.redirect('/admin/dashboard');
        } else {
            req.flash('error_msg', 'Incorrect password');
            res.redirect('/auth/login');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/auth/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    // Placeholder registration logic
    // Implementation would go here
    req.flash('success_msg', 'Registration coming soon!');
    res.redirect('/auth/login');
});

module.exports = router;
