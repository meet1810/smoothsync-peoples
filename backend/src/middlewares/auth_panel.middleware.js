const verifyToken = require("./auth.middleware");

const isAdminOrHR = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.userRole === "ADMIN" || req.userRole === "HR") {
            next();
        } else {
            return res.error(req.__("auth.forbidden"), 403);
        }
    });
};

module.exports = isAdminOrHR;
