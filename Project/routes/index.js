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


// router.get("/auth/login", (req, res) => {
//     res.render("auth/login");
// });

// router.get("/auth/register", (req, res) => {
//     res.render("auth/register");
// });



router.get('/notes', (req, res) => {
    res.render('notes');  
});

router.post('/notes/add', async (req, res) => {
    const { note } = req.body;
    const user = req.session.user;

    try {
        await User.findByIdAndUpdate(user._id, {  // use user._id instead of user.userName
            $push: { notes: note }
        });
        res.json({ success: true, note: note });  // Return JSON response
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ success: false, message: 'Error saving note' });
    }
});



router.get('/notes/all', async (req, res) => {
    const user = req.session.user;

    try {
        const userData = await User.findById(user._id);
        res.json(userData.notes);  // Send only the notes as JSON
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ success: false, message: 'Error fetching notes' });
    }
}); 


module.exports = router;