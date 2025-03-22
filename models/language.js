module.exports = (Sequelize, DataTypes) => {
  const Language = Sequelize.define(
    "Language",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      judge0LanguageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "languages",
    }
  );

  Language.associate = (models) => {
    Language.hasMany(models.Submission, {
      foreignKey: "languageId",
      as: "submissions",
    });
  };

  return Language;
};
