const { User, Submission, DifficultyLevel, Question } = require("../models");
const judgeUtils = require("../utils/judge0Utils");
const Sequelize = require("sequelize");
const codeGenrationUtils = require("../utils/codeGeneratorUtils");

const create = (req, res) => {
  const {
    title,
    description,
    functionName,
    parameters,
    returnType,
    testCases,
    difficultyLevelId,
  } = req.body;
  if (
    !title ||
    !description ||
    !functionName ||
    !parameters ||
    !returnType ||
    !testCases ||
    !difficultyLevelId
  ) {
    res.status(400).send({ message: "missing requird prameters" });
    return;
  }

  const question = new Question({
    title,
    description,
    functionName,
    parameters,
    returnType,
    testCases,
    difficulty,
  });

  question
    .save(question)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Question.",
      });
    });
};

const findAll = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filterByStatus = null,
    filterByDifficulty = null,
  } = req.query;

  try {
    const userId = 1;

    const offset = (page - 1) * limit;

    const whereClause = {};
    const include = [
      {
        model: DifficultyLevel,
        as: "difficultyLevel",
        attributes: ["level", "points"],
      },
      {
        model: Submission,
        as: "submissions",
        where: {
          userId,
          result: Sequelize.literal(
            "JSON_CONTAINS(result, 'true', '$.passed')"
          ),
        },
        required: filterByStatus === "solved",
      },
      {
        model: User,
        as: "favoritedBy",
        where: { id: userId },
        required: filterByStatus === "fav",
      },
    ];

    if (search) {
      whereClause.title = { [Sequelize.Op.iLike]: `%${search}%` };
    }

    if (filterByDifficulty && filterByDifficulty !== "null") {
      whereClause.difficultyLevelId = {
        [Sequelize.Op.in]: Sequelize.literal(`(
          SELECT id FROM difficulty_levels WHERE level = '${filterByDifficulty}'
        )`),
      };
    }

    const questions = await Question.findAndCountAll({
      where: whereClause,
      attributes: ["id", "title", "description", "difficultyLevelId"],
      include,
      offset,
      limit: parseInt(limit),
      distinct: true,
    });

    const formattedQuestions = questions.rows.map((question) => {
      const isSolved = question.submissions && question.submissions.length > 0;

      const isFavorite =
        question.favoritedBy && question.favoritedBy.length > 0;

      return {
        id: question.id,
        title: question.title,
        description: question.description,
        difficultyLevel: question.difficultyLevel,
        isSolved,
        isFavorite,
      };
    });

    res.json({
      total: questions.count,
      totalPages: Math.ceil(questions.count / limit),
      currentPage: parseInt(page),
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching questions." });
  }
};

const findOne = (req, res) => {
  const id = req.params.id;

  Question.findByPk(id, {
    include: {
      model: DifficultyLevel,
      as: "difficultyLevel",
      attributes: ["level", "points"],
    },
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Not found Question with id " + id,
        });
        return;
      }
      let parameters = [];
      try {
        parameters = JSON.parse(data.parameters);
      } catch (error) {
        return res.status(400).send({
          message: "Invalid parameters format",
        });
      }

      const code = codeGenrationUtils.generateDefaultCode(
        "python",
        data.functionName,
        parameters,
        data.returnType
      );

      data.setDataValue("code", code);

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Question with id=" + id,
        error: err.message,
      });
    });
};

const runCode = async (req, res) => {
  const { code, languageId, questionId } = req.body;
  try {
    const question = await Question.findByPk(questionId);

    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    const testCases = Array.isArray(question.testCases)
      ? question.testCases.slice(0, 3)
      : [];

    const results = await judgeUtils.runCodeWithTestCases({
      sourceCode: code,
      languageId,
      testCases,
    });

    const passed = results.every((result) => result.passed);

    res.json({ results, passed });
  } catch (error) {
    console.error("Error running code:", error);
    res
      .status(500)
      .json({ error: "An error occurred while running the code." });
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  runCode,
};
