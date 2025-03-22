module.exports = (Sequelize, DataTypes) => {
  const Session = Sequelize.define("Session", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Session.associate = (models) => {
    Session.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Session;
};
