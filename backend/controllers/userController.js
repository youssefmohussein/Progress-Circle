const User = require('../models/User');

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            points: user.points,
            streak: user.streak,
            joinedAt: user.createdAt,
            savingsEnabled: user.savingsEnabled,
            fitnessEnabled: user.fitnessEnabled,
            nutritionEnabled: user.nutritionEnabled,
            habitsEnabled: user.habitsEnabled,
        },
    });
};

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { name, avatar, savingsEnabled, fitnessEnabled } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (savingsEnabled !== undefined) updateData.savingsEnabled = savingsEnabled;
        if (fitnessEnabled !== undefined) updateData.fitnessEnabled = fitnessEnabled;
        if (req.body.nutritionEnabled !== undefined) updateData.nutritionEnabled = req.body.nutritionEnabled;
        if (req.body.habitsEnabled !== undefined) updateData.habitsEnabled = req.body.habitsEnabled;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                points: user.points,
                streak: user.streak,
                joinedAt: user.createdAt,
                savingsEnabled: user.savingsEnabled,
                fitnessEnabled: user.fitnessEnabled,
                nutritionEnabled: user.nutritionEnabled,
                habitsEnabled: user.habitsEnabled,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfile, updateProfile };
