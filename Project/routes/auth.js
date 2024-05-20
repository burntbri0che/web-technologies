// const express = require("express");
// let router = express.Router();
// let User = require("../models/User");

// router.get("/auth/register", (req,res) => {
//     res.render("auth/register");
// });


// router.post("/auth/register", async (req, res) => {
//     let user = await User.findOne({ email: req.body.email });
//     if (user) {
//         req.session.flash = {
//          type: "danger",
//          message: "User with given name already exist",
//        };
//       res.flash("danger", "User Already Exist");
//       return res.redirect("/auth/register");
//     }
//     user = new User(req.body);
//     await user.save();
//     res.render("auth/login");
//   });

// // router.get("/logout", (req, res) => {
// //     req.session.user = null;
// //     res.flash("success", "Logged out Successfully!");
// //     res.redirect("/login");
// // });


// router.get("/auth/login", (req, res) => {
//     res.render("auth/login");
//   });




// router.post("/auth/login", async (req, res) => {
//     let user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       res.flash("danger", "E-mail is already in use!!");
//       return res.redirect("/auth/register");
//     }
//     if (user.password != req.body.password) {
//       res.flash("danger", "Invalid Password!");
//       return res.redirect("/auth/login");
//     }
//     req.session.user = user;
//     res.flash("Success!", user.name + " Logged In");
//     return res.redirect("/");
//   });


// module.exports = router;




const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.get("/auth/register", (req, res) => {
    res.render("auth/register", { message: req.query.message });
});


router.post("/auth/register", async (req, res) => {

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {

            req.session.flash = {
                type: "danger",
                message: "User already exists"
            };
            //return res.redirect("/auth/register");
        }
        newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
            
        });
        await newUser.save();
        res.redirect("/auth/login?message=Registration successful. Please log in");
    } catch (error) {
        console.error("Registration Error:", error);
        res.redirect("/auth/register?message=An error occurred during registration");
    }
});


router.get("/auth/login", (req, res) => {
    res.render("auth/login", { message: req.query.message });
});


router.post("/auth/login", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.redirect("/auth/login?message=No account found with that email");
        }
        if (user.password !== req.body.password) {
            return res.redirect("/auth/login?message=Invalid password");
        }
        req.session.user = user; 
        res.redirect("/");  
    } catch (error) {
        console.error("Login Error:", error);
        res.redirect("/auth/login?message=An error occurred during login");
    }
});

module.exports = router;
