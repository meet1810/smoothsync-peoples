const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const seedDatabase = require("../utils/seeder");
const logger = require("../config/logger");
const path = require("path");
const fs = require("fs");

// Render Login Page
exports.renderLogin = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/panel/dashboard");
    }
    res.render("login", { error: null });
};

// Process Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check Internal Master Admin (from .env)
        if (email === process.env.PANEL_EMAIL && password === process.env.PANEL_PASSWORD) {
            const token = jwt.sign(
                { id: "MASTER_ADMIN", role: "ADMIN", first_name: "Master", last_name: "Admin" },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );
            res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            logger.info(`Panel MASTER LOGIN successful: ${email}`);
            return res.redirect("/panel/dashboard");
        }

        // 2. Check Database Users
        const user = await db.User.findOne({ where: { email } });

        if (!user || (user.role !== "ADMIN" && user.role !== "HR")) {
            logger.warn(`Panel login failed: ${email}`);
            return res.render("login", { error: "Invalid credentials or unauthorized" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Panel login failed: ${email}`);
            return res.render("login", { error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, first_name: user.first_name || "User", last_name: user.last_name || "" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        logger.info(`Panel login successful: ${email}`);
        res.redirect("/panel/dashboard");
    } catch (err) {
        logger.error(`Panel login error: ${err.message}`);
        res.render("login", { error: "Server error" });
    }
};

// Render Dashboard
exports.renderDashboard = (req, res) => {
    res.render("dashboard", { user: req.user, message: null, type: null });
};

// Logout
exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/panel/login");
};

// Actions
exports.syncDb = async (req, res) => {
    try {
        logger.info(`Sync requested by ${req.user.email}`);
        await db.sequelize.sync({ alter: true });
        logger.info("Database synced.");
        res.render("dashboard", { user: req.user, message: "Database Synced Successfully", type: "success" });
    } catch (err) {
        logger.error(`Sync failed: ${err.message}`);
        res.render("dashboard", { user: req.user, message: "Sync Failed: " + err.message, type: "error" });
    }
};

exports.seedDb = async (req, res) => {
    try {
        logger.info(`Seed requested by ${req.user.email}`);
        const result = await seedDatabase();
        res.render("dashboard", { user: req.user, message: result.message, type: "success" });
    } catch (err) {
        logger.error(`Seed failed: ${err.message}`);
        res.render("dashboard", { user: req.user, message: "Seed Failed: " + err.message, type: "error" });
    }
};

exports.dropDb = async (req, res) => {
    try {
        logger.warn(`DROP DB requested by ${req.user.email}`);
        // Cascade: true forces PostgreSQL to drop tables even with foreign key constraints
        await db.sequelize.drop({ cascade: true, force: true });
        logger.info("Database dropped (Force/Cascade).");
        res.render("dashboard", { user: req.user, message: "Database Dropped (Forcefully) Successfully", type: "success" });
    } catch (err) {
        logger.error(`Drop failed: ${err.message}`);
        res.render("dashboard", { user: req.user, message: "Drop Failed: " + err.message, type: "error" });
    }
};

// Logs Viewer
exports.viewLogs = (req, res) => {
    try {
        const { date, type } = req.query;
        const logType = type === "error" ? "error" : "info";
        const logDate = date || new Date().toISOString().slice(0, 10);
        const filename = `${logType}-${logDate}.log`;
        const logPath = path.join(__dirname, "../logger/logs", filename);

        let logs = [];
        if (fs.existsSync(logPath)) {
            const fileContent = fs.readFileSync(logPath, "utf-8");
            logs = fileContent
                .trim()
                .split("\n")
                .map((line) => {
                    try {
                        return JSON.parse(line);
                    } catch (e) {
                        return null;
                    }
                })
                .filter((l) => l !== null);
        }

        res.render("logs", { user: req.user, logs, date: logDate, type: logType });
    } catch (err) {
        logger.error("Error viewing logs: " + err.message);
        res.render("dashboard", { user: req.user, message: "Error reading logs", type: "error" });
    }
};
