const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Employee Attendance Tracking
 */

/**
 * @swagger
 * /api/attendance/check-in:
 *   post:
 *     summary: Employee Check-in
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checked in successfully
 *       400:
 *         description: Already checked in
 *       500:
 *         description: Internal server error
 */
router.post('/check-in', authMiddleware, attendanceController.checkIn);

/**
 * @swagger
 * /api/attendance/check-out:
 *   post:
 *     summary: Employee Check-out
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checked out successfully
 *       400:
 *         description: Not checked in or already checked out
 *       500:
 *         description: Internal server error
 */
router.post('/check-out', authMiddleware, attendanceController.checkOut);

/**
 * @swagger
 * /api/attendance/today:
 *   get:
 *     summary: Get Today's Attendance Status
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current attendance status
 *       500:
 *         description: Internal server error
 */
router.get('/today', authMiddleware, attendanceController.getAttendance);

module.exports = router;
