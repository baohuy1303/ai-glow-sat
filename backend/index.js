const express = require('express');
<<<<<<< HEAD
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

var admin = require("firebase-admin");

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
=======
const cors = require('cors');
const userRouter = require('./routes/UserRoutes');

require("dotenv").config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
>>>>>>> 9467d701180d4b9f13eb64983acb1df9a8816cd7

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
})