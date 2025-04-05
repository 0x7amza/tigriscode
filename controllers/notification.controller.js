const { Notification, User } = require("../models");

const publicNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const users = await User.findAll();
    for (const user of users) {
      await Notification.create({ userId: user.id, message });
    }
    res.status(201).json({ message: "Notification sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
    });
    await Notification.update(
      { isSeen: true },
      { where: { userId: req.user.id } }
    );
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  publicNotification,
  getNotifications,
};
