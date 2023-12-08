const fs = require("fs");
const path = require("path");
const Question = require("../models/question_model");

const createQuestions = async (req, res) => {
  try {
    const dirPath = path.join(__dirname, "../Questions");
    const files = fs.readdirSync(dirPath);

    for (let file of files) {
      console.log(file);
      const parts = file.split("_");
      const questionType = parts[2].replace("QT", "");
      const level = parts[3].replace("LVL", "");
      const questionNumber = parts[4].replace(".svg", "").replace("Q", "");
      const answer = parts[5].replace(".svg", "");

      const questionData = {
        question: file,
        questionType: Number(questionType),
        level: Number(level),
        questionNumber: Number(questionNumber),
        answer: Number(answer),
      };

      const question = new Question(questionData);
      await question.save();
    }

    res.send("Questions created successfully");
  } catch (err) {
    res.status(500).send("An error occurred while creating questions");
  }
};

module.exports = { createQuestions };
