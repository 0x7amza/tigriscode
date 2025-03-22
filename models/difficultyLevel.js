module.exports = (Sequelize, DataTypes) => {
  const DifficultyLevel = Sequelize.define(
    "DifficultyLevel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "difficulty_levels",
    }
  );

  DifficultyLevel.associate = (models) => {
    DifficultyLevel.hasMany(models.Question, {
      foreignKey: "difficultyLevelId",
      as: "questions",
    });
  };

  return DifficultyLevel;
};
