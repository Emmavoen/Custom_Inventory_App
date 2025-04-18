const express = require("express");
const { profile } = require("../controllers/user.controller.js");
const { verifyAdminOrUserToken } = require("../middlewares/verifyToken.js")

const router = express.Router();

/**
 * @swagger
 * /api/v1/user/me:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: The user's profile
 */
router.get('/me', verifyAdminOrUserToken, profile);

module.exports = router;
