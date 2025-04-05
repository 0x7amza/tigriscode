const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const { getUserStatistics } = require("../utils/userUtils");

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     tags: [user]
 *     summary: Register a new user
 *     description: Register a new user by providing a URL containing user data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL containing user data
 *           example:
 *             url: "https://example.com/user-data"
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               universityNumber: "123456789"
 *               profilePicture: "https://example.com/profile.jpg"
 *               role: "user"
 *               score: 0
 *       400:
 *         description: Invalid input or user already exists
 */

router.post("/signup", userController.signup);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags: [user]
 *     summary: Login user
 *     description: Authenticate user by email and send OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *           example:
 *             email: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "OTP sent successfully!"
 *       400:
 *         description: Invalid email or missing fields
 */

router.post("/login", userController.login);

/**
 * @swagger
 * /api/user/verify:
 *   post:
 *     tags: [user]
 *     summary: Verify OTP
 *     description: Verify OTP sent to the user's email and generate a session token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               otp:
 *                 type: string
 *                 description: OTP code sent to the user
 *           example:
 *             email: "john.doe@example.com"
 *             otp: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully, session token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid OTP or email
 */

router.post("/verify", userController.verifyOTP);

/**
 * @swagger
 * /api/user/logout:
 *   delete:
 *     tags: [user]
 *     summary: Logout user
 *     description: Invalidate the user's session token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: User's session token
 *           example:
 *             token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Logged out successfully!"
 *       400:
 *         description: Invalid token
 */

router.delete("/logout", userController.logout);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags: [user]
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile information along with their statistics.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile and statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     solvedProblems:
 *                       type: integer
 *                       description: Number of unique problems solved by the user.
 *                     totalPoints:
 *                       type: integer
 *                       description: Total points earned by the user.
 *                     globalRank:
 *                       type: integer
 *                       description: Global rank of the user based on their score.
 *                     successRate:
 *                       type: string
 *                       description: Success rate of the user's submissions (e.g., "85%").
 *             example:
 *               user:
 *                 id: 1
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 universityNumber: "123456789"
 *                 profilePicture: "https://example.com/profile.jpg"
 *                 role: "user"
 *                 score: 230
 *               statistics:
 *                 solvedProblems: 20
 *                 totalPoints: 230
 *                 globalRank: 15
 *                 successRate: "85%"
 *       401:
 *         description: Unauthorized, missing or invalid token
 */

router.get("/profile", auth, async (req, res) => {
  const statistics = await getUserStatistics(req.user.id);
  res.send({ user: req.user, statistics });
});

module.exports = router;
