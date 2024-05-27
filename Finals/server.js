const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");



const server = express();


const router = require("./routes/index.js");
const cookieParser = require("cookie-parser");

server.listen(4000);

server.use(express.urlencoded());
server.use(express.json());
server.use(cookieParser());

server.use(session({ secret: "Its  a secret" }));

server.use(require("./middlewares/siteMiddleware.js"));


server.use(express.static("public"));
server.set("view engine", "ejs");


server.use("/", router);
server.use("/", require("./routes/auth.js"));
server.use("/", require("./routes/notes.js"));
server.use("/", require("./routes/tasks.js"));


server.use(require("./middlewares/isAuthenticated.js"));







mongoose.connect("mongodb://localhost:27017/NoteIT").then((data) => {
  console.log("DB Connected");
});


