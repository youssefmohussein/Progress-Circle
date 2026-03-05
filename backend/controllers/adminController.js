const User = require('../models/User');
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');

// Middleware to check admin access
const requireAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res, next) => {
    try {
        const [totalUsers, totalTasks, totalHabits, totalGoals] = await Promise.all([
            User.countDocuments(),
            Task.countDocuments(),
            Habit.countDocuments(),
            Goal.countDocuments(),
        ]);
        res.status(200).json({ success: true, data: { totalUsers, totalTasks, totalHabits, totalGoals } });
    } catch (error) { next(error); }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).sort({ points: -1 }).lean();
        res.status(200).json({ success: true, data: users });
    } catch (error) { next(error); }
};

// @desc    Reset a user's points to 0
// @route   PUT /api/admin/users/:id/reset-points
// @access  Admin
const resetPoints = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { points: 0 }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'Points reset', data: user });
    } catch (error) { next(error); }
};

// @desc    Delete a user and all their data
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Promise.all([
            User.findByIdAndDelete(id),
            Task.deleteMany({ userId: id }),
            Habit.deleteMany({ userId: id }),
            Goal.deleteMany({ userId: id }),
        ]);
        res.status(200).json({ success: true, message: 'User and all associated data deleted' });
    } catch (error) { next(error); }
};

module.exports = { requireAdmin, getStats, getUsers, resetPoints, deleteUser };
