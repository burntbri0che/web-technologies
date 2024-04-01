const express = require("express");
let server = express();
server.set("view engine","ejs");
server.use(express.static("public"));
server.get("/api", function(req,res){
    res.render("api");
})
server.get("/", function(req,res){
    res.render("design");
})

server.listen(3000);