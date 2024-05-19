const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("landing-page");
});

router.get("/contact-form", (req, res) => {
    res.render("contact-form");
});

router.get("/ajax", (req, res) => {
    res.render("ajax");
});


router.get("/auth/login", (req, res) => {
    res.render("auth/login");
});

router.get("/auth/register", (req, res) => {
    res.render("auth/register");
});


module.exports = router;