const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user.controller");
const auth = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - password
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/profile"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPass123!"
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request or user already exists
 */
router.post("/signup", userController.signup);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Authenticate a user and create a session
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns session token
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /api/user/logout:
 *   delete:
 *     summary: Log out a user by destroying their session
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Invalid token
 */
router.delete("/logout", userController.logout);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get the profile of the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the profile of the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", auth, (req, res) => {
  res.send(req.user);
});

module.exports = router;
