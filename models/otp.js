module.exports = (Sequelize, DataTypes) => {
  const otp = Sequelize.define("otp", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return otp;
};
