const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");



const server = express();


const router = require("./routes/index.js");
const cookieParser = require("cookie-parser");

server.listen(3000);

server.use(express.urlencoded());
server.use(express.json());
server.use(cookieParser());

server.use(session({ secret: "Its  a secret" }));

server.use(require("./middlewares/siteMiddleware"));


server.use(express.static("public"));
server.set("view engine", "ejs");


server.use("/", router);
server.use("/", require("./routes/auth"));
server.use("/", require("./routes/notes"));


server.use(require("./middlewares/isAuthenticated"));







mongoose.connect("mongodb://localhost:27017/NoteIT").then((data) => {
  console.log("DB Connected");
});


