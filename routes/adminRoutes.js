const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Content = require('../models/Content');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

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
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    let contents;
    if (req.session.user.role === 'rep_admin') {
        // Rep Admins see everything but with status tracking
        contents = await Content.findAll({ order: [['createdAt', 'DESC']] });
    } else {
        // Admin/Super Admin see everything, prioritized by pending status
        contents = await Content.findAll({ order: [['status', 'DESC'], ['createdAt', 'DESC']] });
    }
    res.render('admin/dashboard', { contents, user: req.session.user });
});

// Create Content Page
router.get('/create', ensureAuthenticated, (req, res) => {
    if (req.session.user.role === 'user') return res.redirect('/');
    res.render('admin/create');
});

// Create Content Action
router.post('/create', ensureAuthenticated, async (req, res) => {
    const { title, description, imageUrl, section } = req.body;
    const status = (req.session.user.role === 'admin' || req.session.user.role === 'super_admin') ? 'approved' : 'pending';

    await Content.create({
        title,
        description,
        imageUrl,
        section,
        status,
        createdBy: req.session.user.id
    });

    req.flash('success_msg', status === 'pending' ? 'Content submitted for verification' : 'Content published successfully');
    res.redirect('/admin/dashboard');
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

// Delete Content Action
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    if (req.session.user.role === 'user') return res.redirect('/');
    await Content.destroy({ where: { id: req.params.id } });
    req.flash('success_msg', 'Content deleted successfully');
    res.redirect('/admin/dashboard');
});

module.exports = router;
