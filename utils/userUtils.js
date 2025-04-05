const { Op, Sequelize } = require("sequelize");
const { User, Submission, Question } = require("../models");

async function getUserStatistics(userId) {
  try {
    const user = await User.findByPk(userId, {
      attributes: ["score"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const solvedProblems = await getNumberOfSolvedProblems(userId);

    const totalPoints = user.score;

    const globalRank = await getGlobalRank(user.score);

    const successRate = await calculateSuccessRate(userId);

    return {
      solvedProblems,
      totalPoints,
      globalRank,
      successRate,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getNumberOfSolvedProblems(userId) {
  try {
    const totalProblems = await Question.count({
      distinct: true,
      col: "id",
    });

    const solvedQuestions = await Submission.findAll({
      where: {
        userId,
        result: {
          success: true,
        },
      },
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("questionId")), "questionId"],
      ],
    });

    const solvedProblemsCount = solvedQuestions.length;

    const result = `${solvedProblemsCount}/${totalProblems}`;

    return result;
  } catch (error) {
    console.error("Error fetching solved problems:", error);
    throw error;
  }
}
async function calculateSuccessRate(userId) {
  const totalSubmissions = await Submission.count({
    where: {
      userId,
    },
  });

  const successfulSubmissions = await Submission.count({
    where: {
      userId,
      result: {
        success: true,
      },
    },
  });

  const successRate =
    totalSubmissions > 0
      ? ((successfulSubmissions / totalSubmissions) * 100).toFixed(2)
      : 0;

  return `${successRate}%`;
}
async function getGlobalRank(score) {
  const users = await User.findAll({
    attributes: ["id", "score"],
    order: [["score", "DESC"]],
  });

  let left = 0;
  let right = users.length - 1;
  let rank = users.length + 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midScore = users[mid].score;

    if (midScore > score) {
      left = mid + 1;
    } else if (midScore < score) {
      right = mid - 1;
    } else {
      rank = mid + 1;
      break;
    }
  }

  return rank;
}

module.exports = {
  getUserStatistics,
};
