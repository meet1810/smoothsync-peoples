const jwt = require("jsonwebtoken");
const db = require("../models");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.error(req.__("auth.no_token"), 403);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;

        const user = await db.User.findByPk(req.userId);
        if (!user || !user.is_active) {
            return res.error(req.__("auth.invalid_token"), 401);
        }

        req.user = user;
        next();
    } catch (err) {
        return res.error(req.__("auth.invalid_token"), 401);
    }
};

module.exports = verifyToken;
