const express = require("express");
const router = express.Router();
const { User, Question, Favorite, Submission } = require("../models");
const auth = require("../middleware/auth.middleware.js");
router.use("/user", require("./user.routes.js"));
router.use("/question", require("./question.routes"));
router.use("/favorite", require("./favorite.routes"));
router.use("/notification", require("./notification.routes"));

router.get("/Leaderboard", async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const users = await User.findAll({
    attributes: ["name", "profilePicture", "score"],
    order: [["score", "DESC"]],
    offset: 0,
    limit,
  });
  res.json(users);
});

router.get("/home", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch favorite questions
    const favoriteQuestions = await Question.findAll({
      where: {},
      attributes: ["id", "title", "description", "difficultyLevel"],
      include: [
        {
          model: User,
          as: "favoritedBy",
          where: { id: userId },
          required: true,
        },
        {
          model: Submission,
          as: "submissions",
          where: { userId, passed: true },
          required: false,
        },
      ],
      limit: 6,
      order: [["id", "DESC"]],
    });

    // Fetch recent questions
    const recentQuestions = await Question.findAndCountAll({
      where: {},
      attributes: ["id", "title", "description", "difficultyLevel"],
      include: [
        {
          model: Submission,
          as: "submissions",
          where: { userId, passed: true },
          required: false,
        },
        {
          model: User,
          as: "favoritedBy",
          where: { id: userId },
          required: false,
        },
      ],
      limit: 6,
      order: [["id", "DESC"]],
      distinct: true,
    });

    // Format favorite questions
    const formattedFavorites = favoriteQuestions.map((question) => {
      const isSolved = question.submissions && question.submissions.length > 0;
      const isFavorite =
        question.favoritedBy && question.favoritedBy.length > 0;

      return {
        id: question.id,
        title: question.title,
        description: question.description,
        difficultyLevel: question.difficultyLevel,
        score:
          question.difficultyLevel === "hard"
            ? 30
            : question.difficultyLevel === "medium"
            ? 20
            : 10,
        isSolved,
        isFavorite,
      };
    });

    // Format recent questions
    const formattedRecentQuestions = recentQuestions.rows.map((question) => {
      const isSolved = question.submissions && question.submissions.length > 0;
      const isFavorite =
        question.favoritedBy && question.favoritedBy.length > 0;

      return {
        id: question.id,
        title: question.title,
        description: question.description,
        difficultyLevel: question.difficultyLevel,
        score:
          question.difficultyLevel === "hard"
            ? 30
            : question.difficultyLevel === "medium"
            ? 20
            : 10,
        isSolved,
        isFavorite,
      };
    });

    // Send response
    res.status(200).json({
      favorites: formattedFavorites,
      recentQuestions: formattedRecentQuestions,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

module.exports = router;
