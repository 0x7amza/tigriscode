module.exports = (Sequelize, DataTypes) => {
  const Question = Sequelize.define(
    "Question",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      functionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parameters: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      returnType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      testCases: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      difficultyLevelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "difficulty_levels",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "questions",
    }
  );

  Question.associate = (models) => {
    Question.belongsTo(models.DifficultyLevel, {
      foreignKey: "difficultyLevelId",
      as: "difficultyLevel",
    });
    Question.hasMany(models.Submission, {
      foreignKey: "questionId",
      as: "submissions",
    });
    Question.belongsToMany(models.User, {
      through: models.Favorite,
      as: "favoritedByQuestions",
      foreignKey: "questionId",
    });
  };

  return Question;
};
