const axios = require("axios");

const JUDGE0_API_URL = "http://localhost:2358";

async function submitCode(sourceCode, languageId, stdin = "") {
  try {
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      {
        source_code: sourceCode,
        language_id: languageId,
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

async function runCodeWithTestCases({ sourceCode, languageId, testCases }) {
  const results = [];

  for (const testCase of testCases) {
    const { input, expectedOutput } = testCase;

    const token = await submitCode(sourceCode, languageId, input);

    let result;
    while (true) {
      result = await getSubmissionStatus(token);

      if (result.status_id === 3) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const actualOutput = Buffer.from(result.stdout || "", "base64").toString(
      "utf-8"
    );

    const passed = actualOutput.trim() === expectedOutput.trim();

    results.push({
      input,
      output: actualOutput,
      expectedOutput,
      passed,
    });
  }
  return results;
}

module.exports = {
  runCodeWithTestCases,
};
