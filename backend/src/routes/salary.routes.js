const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salary.controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// Define isAdmin middleware or check logic (assuming authMiddleware adds user info)
// For now, we'll assume authMiddleware is enough to get req.user, 
// and we might need a separate check for Admin role if not already in authMiddleware.
// Let's assume we can check req.user.role === 'ADMIN' inside the controller or a separate middleware.

// Validation for Upsert
const validateSalary = [
    body('base_wage').isFloat({ min: 0 }).withMessage('Base wage must be a positive number'),
];

// Routes
// Protected by Auth. Ideally also restricted to Admin.
// We'll wrap with authMiddleware.protect if that's the name (verified in view_file).

/**
 * @swagger
 * tags:
 *   name: Salary
 *   description: Salary Structure Management (Admin Only)
 */

/**
 * @swagger
 * /api/salary/{employee_id}:
 *   post:
 *     summary: Create or Update Salary Structure
 *     tags: [Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employee_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - base_wage
 *             properties:
 *               base_wage:
 *                 type: number
 *                 description: Gross wage to calculate components from
 *     responses:
 *       200:
 *         description: Salary structure updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Get Salary Structure
 *     tags: [Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employee_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the employee
 *     responses:
 *       200:
 *         description: Salary structure details
 *       404:
 *         description: Salary structure not found
 *       403:
 *         description: Forbidden (Admin only)
 *       500:
 *         description: Internal server error
 */
router.post('/:employee_id', authMiddleware, isAdmin, validateSalary, salaryController.upsertSalaryStructure);
router.get('/:employee_id', authMiddleware, isAdmin, salaryController.getSalaryStructure);

module.exports = router;
