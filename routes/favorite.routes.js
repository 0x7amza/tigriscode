const express = require("express");
const router = express.Router();
const db = require("../models");
const Favorite = db.favorite;

/**
 * @swagger
 * /api/favorite:
 *   post:
 *     summary: Add a question to a user's favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               questionId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Question added to favorites successfully
 *       500:
 *         description: Error adding favorite
 */
router.post("/", async (req, res) => {
  const { userId, questionId } = req.body;

  try {
    const favorite = await Favorite.create({
      userId,
      questionId,
    });
    res
      .status(201)
      .json({ message: "Question added to favorites successfully.", favorite });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({
      error: "An error occurred while adding the question to favorites.",
    });
  }
});

/**
 * @swagger
 * /api/favorite:
 *   delete:
 *     summary: Remove a question from a user's favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               questionId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Question removed from favorites successfully
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Error removing favorite
 */
router.delete("/api/favorites", async (req, res) => {
  const { userId, questionId } = req.body;

  try {
    const deletedCount = await Favorite.destroy({
      where: { userId, questionId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Favorite not found." });
    }

    res
      .status(200)
      .json({ message: "Question removed from favorites successfully." });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({
      error: "An error occurred while removing the question from favorites.",
    });
  }
});

module.exports = router;
