const express = require("express");
const { registerAdmin, login, logout } = require("../controllers/auth.controller.js");
const { verifyAdminOrUserToken } = require("../middlewares/verifyToken.js");

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/admin/register:
 *   post:
 *     summary: Register a new super admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullname, companyName, email, password]
 *             properties:
 *               fullname:
 *                 type: string
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered
 */
router.post('/admin/register', registerAdmin);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user or admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', login);
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user or admin
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', verifyAdminOrUserToken, logout);

module.exports = router;
