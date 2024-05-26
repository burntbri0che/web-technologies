const mongoose = require ("mongoose");

let userSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    tasks: [String],
    notes: [{
        title: { type: String, required: true },
        body: { type: String, required: true }
    }]
})


const user = mongoose.model("User", userSchema);
//let user = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = user;