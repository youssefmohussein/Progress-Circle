const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');
const GlobalSettings = require('../models/GlobalSettings');

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
        const [totalUsers, totalTasks, totalHabits, totalGoals, premiumUsers] = await Promise.all([
            User.countDocuments(),
            Task.countDocuments(),
            Habit.countDocuments(),
            Goal.countDocuments(),
            User.countDocuments({ plan: 'premium' }),
        ]);

        // Community stats (total trees)
        const treeStats = await User.aggregate([
            { $project: { treeCount: { $size: { $ifNull: ['$trees', []] } } } },
            { $group: { _id: null, totalTrees: { $sum: '$treeCount' } } },
        ]);
        const totalTrees = treeStats[0]?.totalTrees ?? 0;

        res.status(200).json({ 
            success: true, 
            data: { 
                totalUsers, 
                totalTasks, 
                totalHabits, 
                totalGoals, 
                premiumUsers,
                totalTrees,
                growthRate: '+12%' // Placeholder for now
            } 
        });
    } catch (error) { next(error); }
};

// @desc    Update any user field
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User updated successfully', data: user });
    } catch (error) { next(error); }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 }).lean();
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

// @desc    Reward all users with points
// @route   POST /api/admin/reward-all
// @access  Admin
const rewardAll = async (req, res, next) => {
    try {
        const { points, reason } = req.body;
        if (!points || points <= 0) return res.status(400).json({ success: false, message: 'Valid point amount required' });

        await User.updateMany({}, { $inc: { points } });
        
        res.status(200).json({ 
            success: true, 
            message: `Global Injection Success: ${points} points granted to all biologicals for: ${reason || 'System Bonus'}.` 
        });
    } catch (error) { next(error); }
};

// @desc    Get global settings
// @route   GET /api/admin/settings
// @access  Admin
const getSettings = async (req, res, next) => {
    try {
        const settings = await GlobalSettings.getSettings();
        res.status(200).json({ success: true, data: settings });
    } catch (error) { next(error); }
};

// @desc    Update global settings
// @route   PUT /api/admin/settings
// @access  Admin
const updateSettings = async (req, res, next) => {
    try {
        const settings = await GlobalSettings.findOneAndUpdate({}, req.body, { 
            new: true, 
            upsert: true 
        });
        res.status(200).json({ success: true, message: 'Global protocols updated', data: settings });
    } catch (error) { next(error); }
};

module.exports = { requireAdmin, getStats, getUsers, resetPoints, deleteUser, updateUser, rewardAll, getSettings, updateSettings };
