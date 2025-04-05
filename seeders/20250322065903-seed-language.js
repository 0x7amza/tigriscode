module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("languages", [
      {
        name: "Python",
        judge0LanguageId: 71,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "JavaScript",
        judge0LanguageId: 63,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "C++",
        judge0LanguageId: 54,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Java",
        judge0LanguageId: 62,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("languages", null, {});
  },
};
