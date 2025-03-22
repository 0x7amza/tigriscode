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

module.exports = { extractUserData, generateToken };
