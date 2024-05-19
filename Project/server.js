const express = require("express");
const mongoose = require("mongoose");
const server = express();

const router = require("./routes/index.js");

server.listen(3000);

server.use(express.static("public"));
server.set("view engine", "ejs");
server.use("/", router);


mongoose.connect("mongodb://localhost:27017/NoteIT").then((data) => {
  console.log("DB Connected");
});


