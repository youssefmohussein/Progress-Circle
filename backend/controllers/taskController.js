const Task = require('../models/Task');
const User = require('../models/User');

const TASK_POINTS = 10;

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, deadline } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

        const task = await Task.create({
            userId: req.user._id,
            title,
            description,
            priority,
            deadline,
        });
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        const wasCompleted = task.status === 'completed';
        const isNowCompleted = req.body.status === 'completed';

        Object.assign(task, req.body);
        if (isNowCompleted && !task.completedAt) task.completedAt = new Date();

        await task.save();

        // Award points when task first completed
        if (!wasCompleted && isNowCompleted) {
            await User.findByIdAndUpdate(req.user._id, { $inc: { points: TASK_POINTS } });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
