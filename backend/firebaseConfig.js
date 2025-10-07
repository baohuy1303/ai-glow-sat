/* // Import the functions you need from the SDKs you need
const firebase = require("firebase/app");
require("dotenv").config();
const {getFirestore} = require("firebase/firestore");
//const { getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore();

module.exports = { db, app }; */
const { initializeApp, cert } = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const serviceAccount = require("./certs.json"); //Tell me to give you the creds file

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = { db };
