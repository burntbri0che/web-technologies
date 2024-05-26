const express = require("express");
const router = express.Router();


const User = require('../models/User');  

router.get("/", (req, res) => {
    res.render("landing-page");
});

router.get("/contact-form", (req, res) => {
    res.render("contact-form");
});

router.get("/ajax", (req, res) => {
    res.render("ajax");
});





module.exports = router;