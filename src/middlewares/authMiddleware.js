export function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
        } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    }
    
    export function isUser(req, res, next) {
        if (req.user && req.user.role === 'user') {
        next();
        } else {
        res.status(403).json({ message: 'Access denied. Users only.' });
        }
    }