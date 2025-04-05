const {
  User,
  Submission,
  DifficultyLevel,
  Question,
  Language,
} = require("../models");
const judgeUtils = require("../utils/judge0Utils");
const Sequelize = require("sequelize");
const codeGenrationUtils = require("../utils/codeGeneratorUtils");
const utils = require("../utils/utils");

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
//get paginated questions
const findAll = async (req, res) => {
  const {
    search = "",
    filterByStatus = null,
    filterByDifficulty = null,
  } = req.query;

  try {
    const userId = req.user.id;

    const whereClause = {};
    const include = [
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
      attributes: ["id", "title", "description", "difficultyLevel"],
      include,
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
        score:
          question.difficultyLevel == "hard"
            ? 30
            : question.difficultyLevel == "medium"
            ? 20
            : 10,
        isSolved,
        isFavorite,
      };
    });

    res.json(formattedQuestions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching questions." });
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;
  Question.findByPk(id)
    .then(async (data) => {
      if (!data) {
        res.status(404).send({
          message: "Not found Question with id " + id,
        });
        return;
      }
      const languages = await Language.findAll();
      const testCases = JSON.parse(data.testCases);
      const parameters = JSON.parse(data.parameters);
      const QuestionMarkDown = utils.questionMarkDown({
        testCases,
        title: data.title,
        description: data.description,
        parameters,
      });
      data.setDataValue("markdown", QuestionMarkDown);

      res.send({
        markdown: QuestionMarkDown,
        difficultyLevel: data.difficultyLevel,
        testCases,
        parameters,
        defaultCode: languages.map((lang) => ({
          id: lang.id,
          name: lang.name,
          code: codeGenrationUtils.generateDefaultCode(
            lang.name,
            data.functionName,
            parameters,
            data.returnType
          ),
        })),
      });
    })
    .catch((err) => {
      console.error(err);
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

    const testCases = Array.isArray(JSON.parse(question.testCases))
      ? JSON.parse(question.testCases).slice(0, 3)
      : [];

    const results = await judgeUtils.runCodeWithTestCases({
      sourceCode: code,
      languageId,
      testCases,
      question,
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

const submitCode = async (req, res) => {
  const { code, languageId, questionId } = req.body;
  const userId = 1;

  try {
    const question = await Question.findByPk(questionId);

    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    const testCases = Array.isArray(JSON.parse(question.testCases))
      ? JSON.parse(question.testCases)
      : [];

    const results = await judgeUtils.runCodeWithTestCases({
      sourceCode: code,
      languageId,
      testCases,
      question,
    });

    const passed = results.every((result) => result.passed);

    const submission = new Submission({
      userId,
      questionId,
      code,
      languageId,
      result: JSON.stringify(results),
      passed,
    });

    submission
      .save(submission)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Submission.",
        });
      });
  } catch (error) {
    console.error("Error submitting code:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the code." });
  }
};

const getSubmissions = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const submissions = await Submission.findAll({
      where: {
        questionId: id,
        userId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "profilePicture"],
        },
        {
          model: Language,
          as: "language",
          attributes: ["name"],
        },
      ],
    });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      error: "An error occurred while fetching submissions.",
    });
  }
};
module.exports = {
  create,
  findAll,
  findOne,
  runCode,
  getSubmissions,
};
