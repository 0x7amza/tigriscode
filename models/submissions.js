module.exports = (Sequelize, DataTypes) => {
  const Submission = Sequelize.define("Submission", {
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
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "languages",
        key: "id",
      },
    },
    result: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    timeTaken: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    passed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  });

  Submission.associate = (models) => {
    Submission.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Submission.belongsTo(models.Question, {
      foreignKey: "questionId",
      as: "question",
    });

    Submission.belongsTo(models.Language, {
      foreignKey: "languageId",
      as: "language",
    });
  };

  return Submission;
};
