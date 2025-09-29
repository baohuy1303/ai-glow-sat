const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

var admin = require("firebase-admin");

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
})