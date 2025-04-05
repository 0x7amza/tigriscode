module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      universityNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user",
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: "users",
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Session, {
      foreignKey: "userId",
      as: "sessions",
    });

    User.hasMany(models.Submission, {
      foreignKey: "userId",
      as: "submissions",
    });

    User.belongsToMany(models.Question, {
      through: models.Favorite,
      as: "favorites",
      foreignKey: "userId",
    });
    User.hasMany(models.Notification, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return User;
};
