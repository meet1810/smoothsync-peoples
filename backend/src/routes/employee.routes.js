const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware'); // Assuming Admin/HR only

// Validation
const validateCreate = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('department_id').notEmpty().withMessage('Department ID is required'),
];

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee Management (Admin/HR)
 */

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create New Employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *               - department_id
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               department_id:
 *                 type: string
 *                 format: uuid
 *               dob:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               marital_status:
 *                 type: string
 *                 enum: [SINGLE, MARRIED, DIVORCED, WIDOWED]
 *               nationality:
 *                 type: string
 *               personal_email:
 *                 type: string
 *               present_address:
 *                 type: string
 *               permanent_address:
 *                 type: string
 *               about:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *               reporting_manager_id:
 *                 type: string
 *                 format: uuid
 *               account_number:
 *                 type: string
 *               bank_name:
 *                 type: string
 *               ifsc_code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Validation error or Email exists
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, isAdmin, validateCreate, employeeController.createEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update Employee Profile & Bank Details
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               account_number:
 *                 type: string
 *               bank_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, isAdmin, employeeController.updateEmployee);

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get All Employees (List View)
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees with attendance status
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, employeeController.getAllEmployees);

module.exports = router;
