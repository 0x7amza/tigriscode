const { User, Session } = require("../models");
const utils = require("../utils/utils");

const signup = async (req, res) => {
  const { url, password } = req.body;
  if (!url || !password) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const { name, email, universityNumber, profilePicture } =
    await utils.extractUserData(url);
  if (!name) {
    res.status(400).send({
      message: "Invalid URL!",
    });
    return;
  }
  const checkUser = await User.findOne({
    where: {
      universityNumber,
    },
  });
  if (checkUser) {
    res.status(400).send({
      message: "User already exists!",
    });
    return;
  }
  const user = await User.create({
    name,
    email,
    universityNumber,
    password,
    profilePicture,
  });
  res.send(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const user = await User.findOne({
    where: {
      email,
      password,
    },
  });
  if (!user) {
    res.status(400).send({
      message: "Invalid email or password!",
    });
    return;
  }
  const token = utils.generateToken();
  const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  const session = await Session.create({
    userId: user.id,
    token,
    expiresAt,
  });
  res.send({
    token: session.token,
    expiresAt: session.expiresAt,
  });
};

const logout = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).send({
      message: "Content can not be empty!",
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
      message: "Invalid token!",
    });
    return;
  }
  await session.destroy();
  res.send({
    message: "Logged out successfully!",
  });
};

module.exports = {
  signup,
  login,
  logout,
};
