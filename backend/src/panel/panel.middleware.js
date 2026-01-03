const jwt = require("jsonwebtoken");
const db = require("../models");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/panel/login");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // MASTER ADMIN BYPASS
        if (decoded.id === "MASTER_ADMIN") {
            req.user = decoded; // Token already has role/name
            return next();
        }

        const user = await db.User.findByPk(decoded.id);

        if (!user || (user.role !== "ADMIN" && user.role !== "HR")) {
            res.clearCookie("token");
            return res.render("login", { error: "Access denied. Admin or HR only." });
        }

        req.user = user;
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.redirect("/panel/login");
    }
};

module.exports = isAuthenticated;
