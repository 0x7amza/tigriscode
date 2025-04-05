module.exports = (Sequelize, DataTypes) => {
  const Notification = Sequelize.define("Notification", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: "userId" });
  };
  return Notification;
};
