const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const upload = require("../middlewares/upload.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [HR]
 *     Company:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           type: object
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", controller.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: HR Registration
 *     tags: [Auth]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - company_name
 *               - full_name
 *               - email
 *               - phone_number
 *               - password
 *               - confirm_password
 *               - company_logo
 *             properties:
 *               company_name:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *               company_logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: HR Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 */
router.post("/register", upload.single("company_logo"), controller.register);

/**
 * @swagger
 * /api/auth/verify-token:
 *   get:
 *     summary: Verify JWT Token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Token missing or invalid
 */
router.get("/verify-token", controller.verifyToken);

module.exports = router;
