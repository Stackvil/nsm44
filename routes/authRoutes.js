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
    const { username, email, password, fullName, phoneNumber, graduationYear } = req.body;
    try {
        // Check if user exists
        const userExists = await User.findOne({ where: { username } });
        if (userExists) {
            req.flash('error_msg', 'Username already exists');
            return res.redirect('/auth/register');
        }

        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            req.flash('error_msg', 'Email already registered');
            return res.redirect('/auth/register');
        }

        // Create User
        await User.create({
            username,
            email,
            password,
            fullName,
            phoneNumber,
            graduationYear,
            role: 'user' // Default role
        });

        // Auto login or redirect to login (Redirecting to login as per typical flow)
        req.flash('success_msg', 'Registration successful! Please log in.');
        res.redirect('/auth/login');

    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred during registration');
        res.redirect('/auth/register');
    }
});

module.exports = router;
