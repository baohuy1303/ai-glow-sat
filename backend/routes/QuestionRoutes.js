const express = require("express");
const { createQuestion, getQuestions } = require("../controllers/Question");
const questionRouter = express.Router();

questionRouter.post("/post", createQuestion);
questionRouter.get("/get", getQuestions);


module.exports = questionRouter;