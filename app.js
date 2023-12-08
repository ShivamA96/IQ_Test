const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const connectDB = require("./db/mongoose_connection");

const createQuestionsRouter = require("./routes/create_questions_route");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/createQuestions", createQuestionsRouter);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Server has started on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
