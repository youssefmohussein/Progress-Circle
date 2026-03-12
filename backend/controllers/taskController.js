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

        // Gating: Advanced features (Big Tasks, Sub-tasks, Work Counters, Notes) are PREMIUM only
        if (req.user.plan !== 'premium') {
            if (isBigTask || parentId || (totalWork > 0) || notes) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Container tasks, Sub-tasks, Work counters, and Notes are Premium features. Please upgrade to unlock them!' 
                });
            }
        }

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

            let update = { 
                $inc: { points: TASK_POINTS }, 
                $set: { lastTaskCompletionDate: now },
                $addToSet: { streakHistory: today } // Track unique dates of completion
            };

            if (!lastDate) {
                update.$set.streak = 1;
            } else if (lastDate === yesterday) {
                update.$inc.streak = 1;
                // Award bonus every 7-day streak milestone
                const newStreak = (user.streak || 0) + 1;
                if (newStreak % 7 === 0) {
                    update.$inc.points = (update.$inc.points || 0) + 100;
                    if (user.plan === 'premium') {
                        update.$inc.streakFreezes = 1;
                    }
                }
            } else if (lastDate < yesterday) {
                // Streak Freeze logic for Premium users
                if (user.plan === 'premium' && user.streakFreezes > 0 && lastDate === new Date(today - (86400000 * 2)).setHours(0,0,0,0)) {
                    // If missed exactly one day and has a freeze
                    update.$inc.streak = 1;
                    update.$inc.streakFreezes = -1;
                } else {
                    update.$set.streak = 1;
                }
            }
            // if lastDate === today, streak is already counted for today

            await User.findByIdAndUpdate(req.user._id, update);
        } else if (wasCompleted && !isNowCompleted) {
            // Deduct points if task completion is undone
            await User.findByIdAndUpdate(req.user._id, { $inc: { points: -TASK_POINTS } });
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
