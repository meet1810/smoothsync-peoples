const router = require("express").Router();
const controller = require("../controllers/api_panel.controller");
const isAdminOrHR = require("../middlewares/auth_panel.middleware");

// Public route for panel login
router.post("/login", controller.login);

// Protected routes (Admin / HR only)
router.post("/sync", isAdminOrHR, controller.syncDb);
router.post("/seed", isAdminOrHR, controller.seedDb);
router.post("/drop", isAdminOrHR, controller.dropDb); // Setup: Dangerous!
router.get("/logs", isAdminOrHR, controller.getLogs);

module.exports = router;
