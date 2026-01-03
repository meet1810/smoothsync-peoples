const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({
            statusCode: 403,
            status: "error",
            message: "Access denied. Admin role required."
        });
    }
};

module.exports = { isAdmin };
