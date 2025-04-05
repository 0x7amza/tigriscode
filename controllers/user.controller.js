const { User, Session, otp } = require("../models");
const utils = require("../utils/utils");
const { Sequelize, Op } = require("sequelize");

const signup = async (req, res) => {
  const { url } = req.body;
  if (!url) {
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
    const otpCode = utils.generateOTP();
    const createdOtp = await otp.create({
      userId: checkUser.id,
      otp: otpCode,
    });
    await utils.sendOTP(checkUser.email, otpCode);
    return res.send({
      name: checkUser.name,
      email: checkUser.email,
      universityNumber: checkUser.universityNumber,
      profilePicture: checkUser.profilePicture,
      score: checkUser.score,
    });
  }

  const user = await User.create({
    name,
    email,
    universityNumber,
    profilePicture,
  });
  const otpCode = utils.generateOTP();
  await otp.create({
    userId: user.id,
    otp: otpCode,
  });
  await utils.sendOTP(user.email, otpCode);
  res.send(user);
};

const login = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(400).send({
      message: "Invalid email!",
    });
    return;
  }
  const otpCode = utils.generateOTP();
  const createdOtp = await otp.create({
    userId: user.id,
    otp: "111111",
  });
  await utils.sendOTP(user.email, otpCode);
  res.send({
    message: "OTP sent successfully!",
  });
};

const verifyOTP = async (req, res) => {
  const { email } = req.body;
  const OTP = req.body.otp;
  if (!email || !OTP) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(400).send({
      message: "Invalid email!",
    });
    return;
  }
  const otpData = await otp.findOne({
    where: {
      userId: user.id,
      otp: OTP,
      createdAt: {
        [Op.gt]: new Date(new Date() - 10 * 1000 * 60),
      },
    },
  });
  console.log(otpData);

  if (!otpData) {
    res.status(400).send({
      message: "Invalid OTP!",
    });
    return;
  }
  const token = utils.generateToken();
  await Session.create({
    userId: user.id,
    token,
    expiresAt: new Date(new Date() + 60 * 1000 * 60 * 24 * 60),
  });
  await otpData.destroy();
  res.send({
    token,
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
  verifyOTP,
};
