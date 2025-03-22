const db = require("../models");
const User = db.user;
const Session = db.session;
const { Op } = require("sequelize");

const auth = async (req, res, next) => {
  const { identifier, password, token } = req.body;
  if (!identifier || !password || !token) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const user = await User.findOne({
    where: {
      [Op.or]: [{ universityNumber: identifier }, { email: identifier }],
      password,
    },
  });
  if (!user) {
    res.status(400).send({
      message: "Invalid Credentials!",
    });
    return;
  }
  const session = await Session.findOne({
    where: {
      token,
    },
  });
  if (!session) {
    res.status(400).send({
      message: "Invalid Credentials!",
    });
    return;
  }
  req.user = user;
  next();
};

module.exports = auth;
