const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const auth = require("../middleware/auth.middleware.js");
router.post("/", notificationController.publicNotification);

router.get("/", auth, notificationController.getNotifications);

module.exports = router;
