const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/UserRoutes');
const questionRouter = require('./routes/QuestionRoutes');
require("dotenv").config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/question", questionRouter);

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
})