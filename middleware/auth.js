module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.session.user) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view that resource');
        req.session.returnTo = req.originalUrl; // Store the requested URL
        res.redirect('/auth/login');
    },
    ensureRole: (...roles) => {
        return (req, res, next) => {
            const allowedRoles = roles.flat();
            if (req.session.user && allowedRoles.includes(req.session.user.role)) {
                return next();
            }
            req.flash('error_msg', 'Access Denied');
            res.redirect('/admin/dashboard');
        }
    },
    preventCache: (req, res, next) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        next();
    }
};
