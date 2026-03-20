const User = require('../models/User');

// @desc    Get leaderboard (top 50 by effective score)
// @route   GET /api/leaderboard
// @access  Private
const getLeaderboard = async (req, res, next) => {
    try {
        // Fetch all users so we can sort by effective score in JS.
        // Some users have totalScore=0 in DB (pre-save hook not yet fired),
        // so we fall back to points to guarantee rank matches the displayed figure.
        const users = await User.find(
            {},
            'name email avatar avatarConfig themePreferences points streak totalScore totalFocusTime socialStats trees createdAt'
        );

        // Use the SAME formula as authController getMe + User pre('save'):
        //   effectiveScore = points + totalFocusTime + (streak * 10) + (battlesWon * 100)
        // Falls back to this formula if DB totalScore is stale/zero.
        const withScore = users.map(user => {
            const battlesWon = user.socialStats?.battlesWon || 0;
            const calculated = (user.points || 0)
                + (user.totalFocusTime || 0)
                + ((user.streak || 0) * 10)
                + (battlesWon * 100);
            const effectiveScore = (user.totalScore && user.totalScore > 0)
                ? user.totalScore
                : calculated;
            return { user, effectiveScore };
        });

        // Sort descending by effective score, then take top 50
        withScore.sort((a, b) => b.effectiveScore - a.effectiveScore);
        const top50 = withScore.slice(0, 50);

        const leaderboard = top50.map(({ user, effectiveScore }, index) => ({
            rank: index + 1,
            weeklyPoints: effectiveScore,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                avatarConfig: user.avatarConfig,
                themePreferences: user.themePreferences,
                treesCount: (user.trees || []).length,
                points: user.points,
                totalScore: effectiveScore, // expose the corrected value
                streak: user.streak,
                totalFocusTime: user.totalFocusTime || 0,
                joinedAt: user.createdAt,
            },
        }));

        res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLeaderboard };
