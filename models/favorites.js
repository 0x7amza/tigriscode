module.exports = (Sequelize, DataTypes) => {
  const Favorite = Sequelize.define(
    "Favorite",
    {
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
        onDelete: "CASCADE",
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "questions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "favorites",
    }
  );

  Favorite.associate = (models) => {
    models.User.belongsToMany(models.Question, {
      through: Favorite,
      as: "favoriteQuestions",
      foreignKey: "userId",
    });
    models.Question.belongsToMany(models.User, {
      through: Favorite,
      as: "favoritedBy",
      foreignKey: "questionId",
    });
  };

  return Favorite;
};
