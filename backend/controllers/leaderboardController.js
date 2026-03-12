const User = require('../models/User');

// @desc    Get leaderboard (all users sorted by points, top 50)
// @route   GET /api/leaderboard
// @access  Private
const getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.find({}, 'name email avatar avatarConfig themePreferences points streak trees createdAt')
            .sort({ points: -1 })
            .limit(50);

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            weeklyPoints: user.points,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                avatarConfig: user.avatarConfig,
                themePreferences: user.themePreferences,
                treesCount: (user.trees || []).length,
                points: user.points,
                streak: user.streak,
                joinedAt: user.createdAt,
            },
        }));

        res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLeaderboard };
