const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");
const e = require("express");

function generateToken(length = 56) {
  return crypto.randomBytes(length).toString("hex");
}

const extractUserData = async (url) => {
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const name = $('p:contains("Student Name:")').text().split(":")[1]?.trim();

    const universityNumber = $('p:contains("University Number:")')
      .text()
      .split(":")[1]
      ?.trim();

    const email = $('p:contains("University Email:")')
      .text()
      .split(":")[1]
      ?.trim();

    const college = $('p:contains("College:")').text().split(":")[1]?.trim();

    const department = $('p:contains("Department:")')
      .text()
      .split(":")[1]
      ?.trim();

    const profilePicture = $('img[src*="personal_picture.png"]').attr("src");

    return {
      name,
      universityNumber,
      email,
      college,
      department,
      profilePicture,
    };
  } catch (error) {
    return { error: "Invalid URL!" };
  }
};

const questionMarkDown = ({ testCases, title, description, parameters }) => {
  let exampleMarkdown = "";
  for (let i = 0; i < Math.min(testCases.length, 2); i++) {
    const testC = testCases[i];
    const inputValues = testC.input.split(" ");
    let formattedInputs = parameters
      .map((param, index) => `\`${param.name} = ${inputValues[index]}\``)
      .join("\n");

    exampleMarkdown += `
  ## Example ${i + 1}
  
  ### Input  
  ${formattedInputs}
  
  ### Output  
  \`${testC.expectedOutput}\`
  `;
  }

  const QuestionMarkDown = `# ${title}
  
  ### ${description}  
  
  ${exampleMarkdown}
  `.trim();
  return QuestionMarkDown;
};

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

const sendOTP = async (email, otp) => {};
module.exports = {
  extractUserData,
  generateToken,
  questionMarkDown,
  generateOTP,
  sendOTP,
};
