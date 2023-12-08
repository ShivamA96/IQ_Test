const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  question: String,
  questionType: Number,
  level: Number,
  questtionNumber: Number,
  answer: Number,
  questionImage: String,
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
