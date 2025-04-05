const axios = require("axios");
const { Language } = require("../models");
const JUDGE0_API_URL = "http://localhost:2358";
const codeGeneratorUtils = require("./codeGeneratorUtils");

async function submitCode(sourceCode, language_id, stdin = "") {
  try {
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      {
        source_code: sourceCode,
        language_id,
        stdin: Buffer.from(stdin).toString("base64"),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data.token;
  } catch (error) {
    console.error(
      "Error submitting code:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function getSubmissionStatus(token) {
  try {
    const response = await axios.get(`${JUDGE0_API_URL}/submissions/${token}`);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching submission status:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function runCodeWithTestCases({
  sourceCode,
  languageId,
  testCases,
  question,
}) {
  const results = [];
  const language = await Language.findByPk(languageId);
  const language_id = language.judge0LanguageId;
  const languageName = language.name;

  for (const testCase of testCases) {
    const { input, expectedOutput } = testCase;

    const formattedInput = input.split(" ");
    code = codeGeneratorUtils.wrapUserCodeForExecution(
      sourceCode,
      question.functionName,
      JSON.parse(question.parameters),
      question.returnType,
      languageName,
      formattedInput
    );

    const token = await submitCode(code, language_id, formattedInput);

    let result;
    while (true) {
      result = await getSubmissionStatus(token);
      if (result.status !== null) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const actualOutput = result.stdout.replace(/\n$/, "");

    const passed = actualOutput.trim() === expectedOutput.trim();

    results.push({
      input,
      output: actualOutput,
      expectedOutput,
      passed,
      statusDescription: result.status.description,
      compile_output: result.compile_output,
    });
  }
  return results;
}

module.exports = {
  runCodeWithTestCases,
  getSubmissionStatus,
};
