const express = require("express");
const router = express.Router();

router.use("/user", require("./user.routes"));
router.use("/question", require("./question.routes"));
router.use("/favorite", require("./favorite.routes"));

module.exports = router;
