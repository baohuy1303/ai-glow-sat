const express = require("express");
const { createQuestion, getQuestions } = require("../controllers/Question");
const questionRouter = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const Redis = require("ioredis");
const admin = require("firebase-admin");
const FormData = require("form-data");
const fetch = require("node-fetch");

const redis = new Redis();

questionRouter.post("/post", createQuestion);
questionRouter.get("/get", getQuestions);

questionRouter.post("/pdf", upload.single("pdf"), async (req, res) => {
    const formData = new FormData();
    formData.append("pdf", req.file.buffer, req.file.originalname);

    const response = await fetch("http://localhost:8000/pdf", {
        method: "POST",
        body: formData,
    });
    if (!response.ok) throw new Error(`FastAPI error: ${response.statusText}`);

    const data = await response.json();
    try {
        await redis.set(`parsed:${req.file.originalname}`, JSON.stringify(data));
    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding question");
    }
    res.json({ success: true, data: data });
});

questionRouter.post("/finalize", async (req, res) => {
    const { fileName, editedData } = req.body;
    try {
        await redis.set(`final:${fileName}`, JSON.stringify(editedData));
        await admin.firestore().collection("SAT_Questions").add(editedData);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding question");
    }
    res.json({ success: true });
});


module.exports = questionRouter;