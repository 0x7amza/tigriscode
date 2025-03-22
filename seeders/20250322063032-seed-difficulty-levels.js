"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("difficulty_levels", [
      {
        level: "Easy",
        points: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        level: "Medium",
        points: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        level: "Hard",
        points: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("difficulty_levels", null, {});
  },
};
