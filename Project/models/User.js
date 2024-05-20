const mongoose = require ("mongoose");

let userSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    tasks: [String],
    notes: [String]
})


const user = mongoose.model("User", userSchema);
//let user = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = user;