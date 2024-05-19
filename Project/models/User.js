const mongoose = require ("mongoose");

let userSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    tasks: [String],
    notes: [String]
})


let user = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = user;