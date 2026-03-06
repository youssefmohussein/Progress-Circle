const User = require('../models/User');

// @desc    Get leaderboard (all users sorted by points, top 50)
// @route   GET /api/leaderboard
// @access  Private
const getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.find({}, 'name email avatar points streak studyHours completedAssignments workoutStreak createdAt')
            .sort({ points: -1 })
            .limit(50)
            .lean();

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            weeklyPoints: user.points, // simplified; extend with weekly logic if needed
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                points: user.points,
                streak: user.streak,
                studyHours: user.studyHours || 0,
                completedAssignments: user.completedAssignments || 0,
                workoutStreak: user.workoutStreak || 0,
                joinedAt: user.createdAt,
            },
        }));

        res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLeaderboard };
