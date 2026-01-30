const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// Dashboard - View All Data
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    const contents = await Content.findAll();
    res.render('admin/dashboard', { contents, user: req.session.user });
});

// Create Content Page
router.get('/create', ensureAuthenticated, (req, res) => {
    // Rep admin cannot create? User said "can not edit or delete... can ask super admin". 
    // Usually creation is also restricted if not specified. I'll allow creation or restrict it? 
    // "can see all the data but they did not access to eddit or anything".
    // "anything" implies write access. So rep_admin is read-only.
    if (req.session.user.role === 'rep_admin') {
        req.flash('error_msg', 'Representative Admins cannot create content. Please request Super Admin.');
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/create');
});

// Create Content Action
router.post('/create', ensureAuthenticated, async (req, res) => {
    if (req.session.user.role === 'rep_admin') {
        req.flash('error_msg', 'Permission denied.');
        return res.redirect('/admin/dashboard');
    }
    const { title, description, imageUrl, section, year } = req.body;
    await Content.create({ title, description, imageUrl, section, year });
    req.flash('success_msg', 'Content created successfully');
    res.redirect('/admin/dashboard');
});

// Edit Content Page
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    if (req.session.user.role === 'rep_admin') {
        req.flash('error_msg', 'Representative Admins cannot edit content.');
        return res.redirect('/admin/dashboard');
    }
    const content = await Content.findByPk(req.params.id);
    res.render('admin/edit', { content });
});

// Update Content Action
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    if (req.session.user.role === 'rep_admin') {
        req.flash('error_msg', 'Permission denied.');
        return res.redirect('/admin/dashboard');
    }
    const { title, description, imageUrl, section, isVisible, year } = req.body;
    await Content.update({ title, description, imageUrl, section, year, isVisible: isVisible === 'on' }, { where: { id: req.params.id } });
    req.flash('success_msg', 'Content updated successfully');
    res.redirect('/admin/dashboard');
});

// Delete Content Action
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    if (req.session.user.role === 'rep_admin') {
        req.flash('error_msg', 'Representative Admins cannot delete content.');
        return res.redirect('/admin/dashboard');
    }
    await Content.destroy({ where: { id: req.params.id } });
    req.flash('success_msg', 'Content deleted successfully');
    res.redirect('/admin/dashboard');
});

module.exports = router;
