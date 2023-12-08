const express = require("express");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

// Connect to MongoDB
const conn = mongoose.createConnection("mongodb://localhost/test");

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: "mongodb://localhost/test",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

// Create question schema
const QuestionSchema = new mongoose.Schema({
  question: String,
  questionType: Number,
  level: Number,
  answer: Number,
  setType: String,
});

const Question = mongoose.model("Question", QuestionSchema);

const app = express();

// API endpoint to start the test
app.get("/start", async (req, res) => {
  // Get the first question of each set at level 1
  const questions = await Question.find({ level: 1 });
  res.json(questions);
});

// API endpoint to submit an answer and get the next question
app.post("/submit", upload.none(), async (req, res) => {
  // Check the answer and increase the level if correct
  const question = await Question.findById(req.body.questionId);
  if (question.answer === Number(req.body.answer)) {
    question.level++;
    await question.save();
  }

  // Get the next question of the same set at the new level
  const nextQuestion = await Question.findOne({
    setType: question.setType,
    level: question.level,
  });
  res.json(nextQuestion);
});

// API endpoint to submit the test
app.post("/finish", upload.none(), async (req, res) => {
  // Calculate the final score based on the number of correct answers and the levels reached in each set
  // This is left as an exercise for the reader
  res.json({ message: "Test finished" });
});

app.listen(3000, () => console.log("Server started on port 3000"));
