const express = require("express");
const router = express.Router();

const User = require('../models/User');  



router.get('/notes', (req, res) => {
    res.render('notes');  
});

router.post('/notes/add', async (req, res) => {
    const { note } = req.body;
    const user = req.session.user;

    try {
        await User.findByIdAndUpdate(user._id, {
            $push: { notes: note }
        });
        res.json({ success: true, note: note });  
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ success: false, message: 'Error saving note' });
    }
});



router.get('/notes/all', async (req, res) => {
    const user = req.session.user;

    try {
        const userData = await User.findById(user._id);
        res.json(userData.notes);  
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ success: false, message: 'Error fetching notes' });
    }
}); 
//to show user notes as a whole, will apply pagination later


module.exports = router;