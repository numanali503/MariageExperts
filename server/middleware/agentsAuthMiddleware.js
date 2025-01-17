const jwt = require('jsonwebtoken');

// Middleware to verify token and check isAdmin
exports.verifyAgentsToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAgent) {
            return res.status(403).json({ message: 'Access denied. Please Login Again' });
        }
        req.user = {
            id: decoded.id,
            username: decoded.username,
            isAgent: decoded.isAgent,
        };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
