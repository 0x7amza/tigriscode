const express = require("express");
const router = express.Router();
const { User } = require("../models");

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

module.exports = router;
