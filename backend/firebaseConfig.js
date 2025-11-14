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
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('./certs.json'); //Tell me to give you the creds file

// Get storage bucket from env or construct from project ID
// Firebase Storage buckets can be either:
// - {project-id}.appspot.com (default Cloud Storage)
// - {project-id}.firebasestorage.app (Firebase Storage)
const projectId = serviceAccount.project_id || serviceAccount.projectId;

let storageBucket = process.env.storageBucket;

// If not set in env, try to construct it
if (!storageBucket && projectId) {
    // Try Firebase Storage format first (most common for Firebase projects)
    storageBucket = `${projectId}.firebasestorage.app`;
    console.log(`⚠️  storageBucket not set in .env, using: ${storageBucket}`);
    console.log(
        `⚠️  If this is incorrect, set storageBucket in your .env file`
    );
}

// Initialize Firebase Admin
const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: storageBucket,
});

const db = getFirestore();
const storage = getStorage();

// Get the bucket explicitly
let bucket;
if (storageBucket) {
    bucket = storage.bucket(storageBucket);
    console.log(`✅ Firebase Storage bucket initialized: ${storageBucket}`);
} else {
    // Fallback to default bucket
    bucket = storage.bucket();
    console.log(`⚠️  Using default bucket (bucket name not specified)`);
}

module.exports = { db, bucket };
