const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOTP } = require('../utils/emailService');

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

        if (!user.isActive) {
            req.flash('error_msg', 'Please verify your email before logging in');
            req.session.verifyEmail = user.email; // Store for verification redirect
            return res.redirect('/auth/verify-otp');
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActive,
                batch: user.batch,
                graduationYear: user.graduationYear,
                phone: user.phone,
                profileImage: user.profileImage
            };
            req.flash('success_msg', 'Logged in successfully');

            // Redirect based on role or returnTo
            const redirectUrl = req.session.returnTo || (user.role === 'user' ? '/user/dashboard' : '/admin/dashboard');
            delete req.session.returnTo; // Clear the returnTo session variable
            res.redirect(redirectUrl);
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
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const user = await User.findOne({ where: { email } });

        if (user && user.isActive) {
            req.flash('error_msg', 'Email already registered');
            return res.redirect('/auth/register');
        }

        // Generate 6-digit OTP and expiration (10 mins)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60000);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (user) {
            // Update existing unverified user
            await user.update({ username, password: hashedPassword, otp, otpExpires });
        } else {
            // Create new unverified user
            await User.create({ username, email, password: hashedPassword, otp, otpExpires, isActive: false, role: 'user' });
        }

        // Store email in session for the verification page
        req.session.verifyEmail = email;

        // Send OTP via email
        const sent = await sendOTP(email, otp);

        if (sent) {
            req.flash('success_msg', 'Verification code sent to your email');
            res.redirect('/auth/verify-otp');
        } else {
            req.flash('error_msg', 'Failed to send verification email. Try again.');
            res.redirect('/auth/register');
        }
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred during registration');
        res.redirect('/auth/register');
    }
});

router.get('/verify-otp', (req, res) => {
    if (!req.session.verifyEmail) return res.redirect('/auth/register');
    res.render('auth/verify-otp');
});

router.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    const email = req.session.verifyEmail;

    if (!email) {
        req.flash('error_msg', 'Session expired. Please register again.');
        return res.redirect('/auth/register');
    }

    try {
        const user = await User.findOne({ where: { email, otp } });

        if (!user) {
            req.flash('error_msg', 'Invalid verification code');
            return res.redirect('/auth/verify-otp');
        }

        if (new Date() > user.otpExpires) {
            req.flash('error_msg', 'Verification code expired. Please register again.');
            return res.redirect('/auth/register');
        }

        // Verify user
        await user.update({ isActive: true, otp: null, otpExpires: null });

        delete req.session.verifyEmail;
        req.flash('success_msg', 'Email verified successfully! You can now log in.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error during verification');
        res.redirect('/auth/verify-otp');
    }
});

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password');
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            req.flash('error_msg', 'No account found with this email');
            return res.redirect('/auth/forgot-password');
        }

        // Generate reset OTP and expiration (10 mins)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60000);

        await user.update({ otp, otpExpires });

        // Store email in session for the reset page
        req.session.resetEmail = email;

        const sent = await sendOTP(email, otp);

        if (sent) {
            req.flash('success_msg', 'Reset code sent to your email');
            res.redirect('/auth/reset-password');
        } else {
            req.flash('error_msg', 'Failed to send reset email');
            res.redirect('/auth/forgot-password');
        }
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred');
        res.redirect('/auth/forgot-password');
    }
});

router.get('/reset-password', (req, res) => {
    if (!req.session.resetEmail) return res.redirect('/auth/forgot-password');
    res.render('auth/reset-password');
});

router.post('/reset-password', async (req, res) => {
    const { otp, newPassword } = req.body;
    const email = req.session.resetEmail;

    if (!email) {
        req.flash('error_msg', 'Session expired. Please start over.');
        return res.redirect('/auth/forgot-password');
    }

    try {
        const user = await User.findOne({ where: { email, otp } });

        if (!user) {
            req.flash('error_msg', 'Invalid reset code');
            return res.redirect('/auth/reset-password');
        }

        if (new Date() > user.otpExpires) {
            req.flash('error_msg', 'Reset code expired. Please start over.');
            return res.redirect('/auth/forgot-password');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword, otp: null, otpExpires: null });

        delete req.session.resetEmail;
        req.flash('success_msg', 'Password updated successfully! You can now log in.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating password');
        res.redirect('/auth/reset-password');
    }
});

module.exports = router;
