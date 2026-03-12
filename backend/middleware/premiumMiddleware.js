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

    const isPremium =
        user.plan === 'premium' &&
        user.subscription?.status === 'active' &&
        user.subscription?.currentPeriodEnd &&
        new Date(user.subscription.currentPeriodEnd) > new Date();

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
