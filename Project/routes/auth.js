// const express = require("express");
// let router = express.Router();
// let User = require("../models/User");




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
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");


router.get("/auth/register", (req,res) => {
    res.render("auth/register");
});


router.get("/auth/login", (req, res) => {
    res.render("auth/login");
  });



router.get("/auth/logout", (req, res) => {
    req.session.user = null;
    res.flash("success", "Logged out Successfully");
    res.redirect("/login");
  });



// Registration Route
router.post("/auth/register", async (req, res) => {
    try {
        const { email, userName, password } = req.body;
        const userExists = await User.findOne({ email: email });

        if (userExists) {
            res.flash('danger', 'User already exists with that email');
            return res.redirect("/auth/register");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName: userName,
            email: email,
            password: hashedPassword
        });
        await newUser.save();

        res.flash('success', 'Registration successful. Please log in.');
        res.redirect("/auth/login");
    } catch (error) {
        console.error("Registration Error:", error);
        res.flash('danger', 'An error occurred during registration');
        res.redirect("/auth/register");
    }
});

// Login Route
router.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            res.flash('danger', 'No account found with that email');
            return res.redirect("/auth/login");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.flash('danger', 'Invalid password');
            return res.redirect("/auth/login");
        }

        req.session.user = user;
        res.flash('success', 'Logged in successfully');
        res.redirect("/");
    } catch (error) {
        console.error("Login Error:", error);
        res.flash('danger', 'An error occurred during login');
        res.redirect("/auth/login");
    }
});


module.exports = router;
