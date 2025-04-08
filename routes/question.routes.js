const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");
const auth = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/question:
 *   get:
 *     summary: Retrieve a paginated list of questions
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of questions per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for question titles
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 */
router.get("/", auth, questionController.findAll);

/**
 * @swagger
 * /api/question/{id}:
 *   get:
 *     summary: Retrieve a specific question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: int64
 *         description: The ID of the question
 *     responses:
 *       200:
 *         description: The requested question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 */
router.get("/:id", auth, questionController.findOne);

/**
 * @swagger
 * /api/question/{id}/run:
 *   post:
 *     summary: Run code against a specific question's test cases
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: int64
 *         description: The ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               languageId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Results of the code execution
 *       404:
 *         description: Question not found
 *       500:
 *         description: Error running the code
 */
router.post("/:id/run", questionController.runCode);

router.post("/:id/submit", auth, questionController.submitCode);
module.exports = router;
