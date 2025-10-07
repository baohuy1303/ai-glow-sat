const { db } = require("../firebaseConfig");
const { userSchema } = require("../models/user");

const registerUser = async (req, res) => {
    const user = userSchema.parse(req.body);
    
    try {
        const docRef = db.collection("users");
        await docRef.add(user);
        res.send("User added");
    } catch (err) {
        console.log(err);
        res.send("Error adding user");
    }
}

module.exports = { registerUser };

