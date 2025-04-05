const express = require("express");
const router = express.Router();
const db = require("../models");
const { Favorite } = db;
const auth = require("../middleware/auth.middleware");

//toggle favorite status for a question
router.put("/:questionId", auth, async (req, res) => {
  const { questionId } = req.params;
  const userId = req.user.id;

  try {
    const favorite = await Favorite.findOne({
      where: { userId, questionId },
    });

    if (favorite) {
      await Favorite.destroy({
        where: { userId, questionId },
      });
      res.status(200).json({ message: "Favorite removed successfully." });
    } else {
      await Favorite.create({
        userId,
        questionId,
      });
      res.status(201).json({ message: "Favorite added successfully." });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      error: "An error occurred while toggling the favorite status.",
    });
  }
});

module.exports = router;
