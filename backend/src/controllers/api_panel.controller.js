const fs = require("fs");
const path = require("path");
const db = require("../models");
const logger = require("../config/logger");
const seedDatabase = require("../utils/seeder");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login for API Panel (ADMIN / HR only)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            logger.warn(`API Panel login failed: User not found - ${email}`);
            return res.error("Invalid credentials", 401);
        }

        if (user.role !== "ADMIN" && user.role !== "HR") {
            logger.warn(`API Panel login denied: Unauthorized role - ${email} (${user.role})`);
            return res.error("Access denied. Admin or HR only.", 403);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`API Panel login failed: Invalid password - ${email}`);
            return res.error("Invalid credentials", 401);
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        logger.info(`API Panel login successful: ${email}`);
        res.success("Login successful", { token, role: user.role });
    } catch (err) {
        logger.error(`API Panel login error: ${err.message}`);
        res.error("Server error", 500);
    }
};

// Sync Database
exports.syncDb = async (req, res) => {
    try {
        logger.info(`Database sync requested by ${req.user.email}`);
        await db.sequelize.sync({ alter: true });
        logger.info("Database sync completed successfully.");
        res.success("Database synced successfully");
    } catch (err) {
        logger.error(`Database sync failed: ${err.message}`);
        res.error("Sync failed: " + err.message, 500);
    }
};

// Seed Database
exports.seedDb = async (req, res) => {
    try {
        logger.info(`Database seed requested by ${req.user.email}`);
        await seedDatabase();
        res.success("Database seeded successfully");
    } catch (err) {
        logger.error(`Database seed failed: ${err.message}`);
        res.error("Seed failed: " + err.message, 500);
    }
};

// Drop Database
exports.dropDb = async (req, res) => {
    try {
        logger.warn(`⚠️ DATABASE DROP REQUESTED BY ${req.user.email} ⚠️`);
        await db.sequelize.drop();
        logger.info("Database dropped successfully.");
        res.success("Database dropped successfully");
    } catch (err) {
        logger.error(`Database drop failed: ${err.message}`);
        res.error("Drop failed: " + err.message, 500);
    }
};

// Get Logs
exports.getLogs = async (req, res) => {
    try {
        const { date, type } = req.query; // date=YYYY-MM-DD, type=info|error
        const logType = type === "error" ? "error" : "info";
        const logDate = date || new Date().toISOString().slice(0, 10);
        const filename = `${logType}-${logDate}.log`;
        const logPath = path.join(__dirname, "../logger/logs", filename);

        if (!fs.existsSync(logPath)) {
            return res.error("Log file not found", 404);
        }

        const fileContent = fs.readFileSync(logPath, "utf-8");
        // Parse each line as JSON
        const logs = fileContent
            .trim()
            .split("\n")
            .map((line) => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return null;
                }
            })
            .filter((log) => log !== null);

        res.success("Logs retrieved", logs);
    } catch (err) {
        logger.error(`Get logs failed: ${err.message}`);
        res.error("Failed to retrieve logs", 500);
    }
};
