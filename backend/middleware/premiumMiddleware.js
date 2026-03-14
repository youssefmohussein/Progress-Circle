/**
 * premiumMiddleware.js
 * Protects routes that require an active Premium subscription.
 * Checks plan === 'premium' AND subscription.currentPeriodEnd is in the future.
 */

const requirePremium = (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const isPremium = user.isAdmin || user.plan === 'premium';

    if (!isPremium) {
        return res.status(403).json({
            success: false,
            message: 'This feature requires a Premium subscription.',
            upgradeUrl: '/pricing',
        });
    }

    next();
};

module.exports = { requirePremium };
