const express = require("express");
const server = express();

const router = require("./routes/index.js");

server.listen(3000);

server.use(express.static("public"));
server.set("view engine", "ejs");
server.use("/", router);