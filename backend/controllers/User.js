const { db } = require("../firebaseConfig");
const { userSchema } = require("../models/user");
const admin = require("firebase-admin");

const registerUser = async (req, res) => {
    const user = userSchema.parse(req.body);
    try {
        await admin.auth().createUserWithEmailAndPassword({
            email: user.email,
            password: user.password,
            emailVerified: user.emailVerified || false,
            role: user.role || 'user',
        });
        res.status(201).send("User added");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding user");
    }
}

module.exports = { registerUser };

