const express = require("express");
const router = express.Router();

const User = require('../models/User');  



router.get('/notes', (req, res) => {
    res.render('notes');  
});

router.post('/notes/add', async (req, res) => {
    const { title, body } = req.body;  
    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId);
        user.notes.push({ title, body });  
        await user.save();
        res.status(200).send("Note added successfully");
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Error saving note' });
    }
});




router.get('/notes/all', async (req, res) => {
    const { page = 1, limit = 6 } = req.query;  // Default to page 1 and limit 6 if not provided
    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId);
        // Calculate the starting index
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const notes = user.notes.slice(startIndex, endIndex);  // Get the slice of notes for the page
        const totalPages = Math.ceil(user.notes.length / limit);  // Calculate total pages

        res.json({
            notes: notes,
            page: parseInt(page),
            totalPages: totalPages
        });  
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ success: false, message: 'Error fetching notes' });
    }
});
 
//to show user notes as a whole, will apply pagination later

router.delete('/notes/delete/:noteId', async (req, res) => {
    const userId = req.session.user._id;
    const noteId = req.params.noteId;

    try {
        await User.updateOne(
            { _id: userId },
            { $pull: { notes: { _id: noteId } } }
        );
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Error deleting note', error: error });
    }
});

router.get('/notes/get/:noteId', async (req, res) => {
    const userId = req.session.user._id;
    const noteId = req.params.noteId;

    try {
        const user = await User.findById(userId);
        const note = user.notes.id(noteId);  // Use Mongoose's id method to find subdocument
        if (!note) {
            return res.status(404).send("Note not found");
        }
        res.json(note);
    } catch (error) {
        console.error('Error fetching note for editing:', error);
        res.status(500).send("Error fetching note for editing");
    }
});

router.put('/notes/update/:noteId', async (req, res) => {
    const userId = req.session.user._id;
    const noteId = req.params.noteId;
    const { title, body } = req.body;

    try {
        const user = await User.findById(userId);
        const note = user.notes.id(noteId);
        if (!note) {
            return res.status(404).send("Note not found");
        }
        note.title = title;
        note.body = body;
        await user.save();
        res.send("Note updated successfully");
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).send("Error updating note");
    }
});




module.exports = router;