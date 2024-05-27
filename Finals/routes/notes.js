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
    const { page = 1, limit = 6 } = req.query;  
    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId);
        
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const notes = user.notes.slice(startIndex, endIndex);  
        const totalPages = Math.ceil(user.notes.length / limit);  

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
        const note = user.notes.id(noteId);  
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


//finals ka kaam

router.get('/notes/search', async (req, res) => {
    const userId = req.session.user._id; // Assuming user ID is stored in session
    const searchQuery = req.query.search; // Get the search term from query parameters

    // Initialize search history in session if it doesn't exist
    if (!req.session.searchHistory) {
        req.session.searchHistory = [];
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Store the current search query in session
        req.session.searchHistory.push(searchQuery);
        // Ensure the search history doesn't grow indefinitely (optional)
        if (req.session.searchHistory.length > 10) { // keep last 10 searches
            req.session.searchHistory.shift(); // Remove the oldest search query
        }

        // Filter notes by search query
        let filteredNotes = user.notes.filter(note =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.body.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Implement pagination (assumed to be implemented as before)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedNotes = filteredNotes.slice(startIndex, endIndex);

        res.json({
            notes: paginatedNotes,
            currentPage: page,
            totalPages: Math.ceil(filteredNotes.length / limit)
        });
    } catch (error) {
        console.error('Error searching notes:', error);
        res.status(500).json({ message: 'Error searching notes', error });
    }
});



router.get('/search-history', (req, res) => {
    const searchHistory = req.session.searchHistory || [];
    res.render('searchHistory', { searchHistory });
});






module.exports = router;