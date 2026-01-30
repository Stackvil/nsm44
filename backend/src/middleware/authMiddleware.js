const jwt = require('jsonwebtoken');

// 1. Authenticate Token Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// 2. Authorize Role Middleware
// Usage: authorizeRole(['admin', 'super_admin'])
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // "Super Admin" has access to everything by default?
        // If we want strict hierarchy, we can check levels.
        // For now, explicit allowedRoles array is safest.

        // However, let's implement the hierarchy logic requested:
        // Super Admin > Admin > Rep > User
        const roleHierarchy = {
            'super_admin': 4,
            'admin': 3,
            'rep_admin': 2,
            'user': 1
        };

        const userRoleLevel = roleHierarchy[req.user.role] || 0;

        // Check if any of the allowed roles is satisfied or if user has higher privilege
        // Actually, usually we pass the "minimum required role".
        // But since the user asked for explicit "priority order", let's be flexible.
        // If allowedRoles contains 'admin', super_admin (level 4) should also pass.

        // Let's assume allowedRoles contains the *target* permitted roles.
        // We check if the user's role is in the list.
        // OR if the user is a super_admin (god mode).

        if (req.user.role === 'super_admin') {
            return next();
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
    };
};

module.exports = {
    authenticateToken,
    authorizeRole
};
