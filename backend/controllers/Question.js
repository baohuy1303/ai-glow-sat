const { questionSchema } = require("../models/Question");
const { db } = require("../firebaseConfig");

const createQuestion = async (req, res) => {
    const question = questionSchema.safeParse(req.body);
    if (!question.success) {
        return res.status(400).json({ error: question.error.message });
    }
    try {
        await db.collection("questions").add(question);
        res.status(201).send("Question created");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating question");
    }
}

const getQuestions = async (req, res) => {
    try {
        const questions = await db.collection("questions").get();
        res.status(200).json(questions.docs.map(doc => doc.data()));
    } catch (err) {
        console.log(err);
        res.status(500).send("Error getting questions");
    }
}

module.exports = { createQuestion, getQuestions };