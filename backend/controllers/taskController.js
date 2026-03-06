const Task = require('../models/Task');
const User = require('../models/User');

const TASK_POINTS = 10;

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
    try {
        const query = { userId: req.user._id };
        // Optionally filter by parent (e.g., if we want sub-tasks for a big task)
        if (req.query.parentId) {
            query.parentId = req.query.parentId;
        } else if (req.query.onlyBig) {
            query.isBigTask = true;
        }

        const tasks = await Task.find(query)
            .populate('categoryId')
            .populate('parentId', 'title')
            .sort({ createdAt: -1 });
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
        const {
            title, description, priority, deadline, categoryId,
            estimatedTime, alertsEnabled, isBigTask, parentId,
            notes, totalWork, completedWork
        } = req.body;

        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

        const task = await Task.create({
            userId: req.user._id,
            title,
            description,
            priority,
            deadline,
            categoryId,
            estimatedTime,
            alertsEnabled,
            isBigTask,
            parentId,
            notes,
            totalWork,
            completedWork
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

        // Award points and update streak when task first completed
        if (!wasCompleted && isNowCompleted) {
            const user = await User.findById(req.user._id);
            const now = new Date();
            const today = new Date(now).setHours(0, 0, 0, 0);
            const yesterday = new Date(today - 86400000).getTime();
            const lastDate = user.lastTaskCompletionDate ? new Date(user.lastTaskCompletionDate).setHours(0, 0, 0, 0) : null;

            let update = { $inc: { points: TASK_POINTS }, $set: { lastTaskCompletionDate: now } };

            if (!lastDate) {
                update.$set.streak = 1;
            } else if (lastDate === yesterday) {
                update.$inc.streak = 1;
            } else if (lastDate < yesterday) {
                update.$set.streak = 1;
            }
            // if lastDate === today, streak is already counted for today

            await User.findByIdAndUpdate(req.user._id, update);
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
