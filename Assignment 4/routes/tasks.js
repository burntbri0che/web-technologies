const express = require("express");
const router = express.Router();
const User = require('../models/User');  // Ensure this model has a tasks array

// Route to render the task form page
router.get('/tasks', (req, res) => {
    res.render('tasks');  // Make sure you have 'tasks.ejs' in your views
});

// Route to add a new task
router.post('/tasks/add', async (req, res) => {
    const { description, date } = req.body;  // Capture description and date from the form
    const userId = req.session.user._id;  // Assuming the user's ID is stored in the session

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Push the new task to the user's tasks array
        user.tasks.push({
            description: description,
            date: new Date(date)  // Ensure the date is stored as a Date object
        });

        // Save the user document with the new task
        await user.save();

        // Option 1: Redirect or send a message
        res.redirect('/tasks');  // Redirect to a page where tasks are listed

        // Option 2: Send a success message directly (Choose one response type)
        // res.status(200).send("Task added successfully");

    } catch (error) {
        console.error('Error saving task:', error);
        res.status(500).json({ message: 'Error adding task', error: error });
    }
});


router.get('/tasks/all', async (req, res) => {
    const userId = req.session.user._id;  

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ tasks: user.tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});





router.delete('/tasks/delete/:taskId', async (req, res) => {
    const userId = req.session.user._id;
    const taskId = req.params.taskId;

    try {
        await User.updateOne(
            { _id: userId },
            { $pull: { tasks: { _id: taskId } } }
        );
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task', error: error });
    }
});


router.get('/tasks/get/:taskId', async (req, res) => {
    const userId = req.session.user._id;
    const taskId = req.params.taskId;

    try {
        const user = await User.findById(userId);
        const task = user.tasks.id(taskId);  
        if (!task) {
            return res.status(404).send("Task not found");
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task for editing:', error);
        res.status(500).send("Error fetching task for editing");
    }
});

// Route to update a specific task
router.put('/tasks/update/:taskId', async (req, res) => {
    const userId = req.session.user._id;
    const taskId = req.params.taskId;
    const { description, date } = req.body;

    try {
        const user = await User.findById(userId);
        const task = user.tasks.id(taskId);
        if (!task) {
            return res.status(404).send("Task not found");
        }
        task.description = description;
        task.date = date;
        await user.save();
        res.send("Task updated successfully");
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send("Error updating task");
    }
});

module.exports = router;
