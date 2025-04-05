const { User, Session } = require("../models");
const { Op } = require("sequelize");
const auth = async (req, res, next) => {
  try {
    const token = req.body?.token || req.query?.token || req.headers?.token;
    if (!token) {
      return res.status(400).send({
        message: "Token can not be empty!",
      });
    }

    const session = await Session.findOne({
      where: {
        token,
      },
    });

    if (!session) {
      return res.status(400).send({
        message: "Invalid Credentials!",
      });
    }

    const userId = session.userId;

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(400).send({
        message: "Invalid Credentials!",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports = auth;
