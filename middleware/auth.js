module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.session.user) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/auth/login');
    },
    ensureRole: (...roles) => {
        return (req, res, next) => {
            if (req.session.user && roles.includes(req.session.user.role)) {
                return next();
            }
            req.flash('error_msg', 'Access Denied');
            res.redirect('/admin/dashboard');
        }
    }
};
