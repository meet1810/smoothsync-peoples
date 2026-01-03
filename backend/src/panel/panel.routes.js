const router = require("express").Router();
const controller = require("./panel.controller");
const isAuthenticated = require("./panel.middleware");

// Public
router.get("/login", controller.renderLogin);
router.post("/login", controller.login);
router.get("/logout", controller.logout);

// Protected
router.get("/dashboard", isAuthenticated, controller.renderDashboard);
router.post("/sync", isAuthenticated, controller.syncDb);
router.post("/seed", isAuthenticated, controller.seedDb);
router.post("/drop", isAuthenticated, controller.dropDb);
router.get("/logs", isAuthenticated, controller.viewLogs);

module.exports = router;
