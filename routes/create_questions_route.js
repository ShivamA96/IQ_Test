const { createQuestions } = require("../controllers/create_questions");

const express = require("express");
const router = express.Router();

router.post("/", createQuestions);

module.exports = router;
