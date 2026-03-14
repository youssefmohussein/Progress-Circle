const PromoCode = require('../models/PromoCode');
const User = require('../models/User');

// --- ADMIN ROUTES ---

// @desc    Create a new promo code
// @route   POST /api/promocodes
// @access  Admin
exports.createPromoCode = async (req, res, next) => {
    try {
        const { code, rewardType, rewardValue, maxUses, expiresAt } = req.body;

        const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
        if (existingCode) {
            return res.status(400).json({ success: false, message: 'Promo code already exists' });
        }

        const promoCode = await PromoCode.create({
            code: code.toUpperCase(),
            rewardType,
            rewardValue,
            maxUses: maxUses || Infinity,
            expiresAt: expiresAt || null,
        });

        res.status(201).json({ success: true, data: promoCode });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all promo codes
// @route   GET /api/promocodes
// @access  Admin
exports.getPromoCodes = async (req, res, next) => {
    try {
        const promoCodes = await PromoCode.find().sort('-createdAt');
        res.status(200).json({ success: true, data: promoCodes });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a promo code (e.g., toggle active status)
// @route   PUT /api/promocodes/:id
// @access  Admin
exports.updatePromoCode = async (req, res, next) => {
    try {
        const promoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!promoCode) {
            return res.status(404).json({ success: false, message: 'Promo code not found' });
        }

        res.status(200).json({ success: true, data: promoCode });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a promo code
// @route   DELETE /api/promocodes/:id
// @access  Admin
exports.deletePromoCode = async (req, res, next) => {
    try {
        const promoCode = await PromoCode.findByIdAndDelete(req.params.id);

        if (!promoCode) {
            return res.status(404).json({ success: false, message: 'Promo code not found' });
        }

        res.status(200).json({ success: true, message: 'Promo code deleted' });
    } catch (error) {
        next(error);
    }
};

// --- USER ROUTES ---

// @desc    Redeem a promo code
// @route   POST /api/users/redeem-promo
// @access  Private
exports.redeemPromoCode = async (req, res, next) => {
    try {
        const { code } = req.body;
        const user = req.user;

        if (!code) {
            return res.status(400).json({ success: false, message: 'Please provide a promo code' });
        }

        const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

        if (!promoCode) {
            return res.status(404).json({ success: false, message: 'Invalid promo code' });
        }

        if (!promoCode.isActive) {
            return res.status(400).json({ success: false, message: 'Promo code is inactive' });
        }

        if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
            return res.status(400).json({ success: false, message: 'Promo code has expired' });
        }

        if (promoCode.usedCount >= promoCode.maxUses) {
            return res.status(400).json({ success: false, message: 'Promo code usage limit reached' });
        }

        // Check if user already redeemed this code
        if (user.redeemedPromoCodes && user.redeemedPromoCodes.includes(promoCode.code)) {
            return res.status(400).json({ success: false, message: 'You have already redeemed this promo code' });
        }

        // Apply reward
        let rewardMessage = '';
        if (promoCode.rewardType === 'premium_days') {
            const daysToAdd = promoCode.rewardValue;
            
            // Calculate new period end
            let currentEnd = user.subscription?.currentPeriodEnd ? new Date(user.subscription.currentPeriodEnd) : new Date();
            if (currentEnd < new Date()) currentEnd = new Date(); // If expired, start from today
            
            currentEnd.setDate(currentEnd.getDate() + daysToAdd);

            user.plan = 'premium';
            if (!user.subscription) user.subscription = {};
            user.subscription.status = 'active';
            user.subscription.currentPeriodEnd = currentEnd;
            rewardMessage = `${daysToAdd} days of Premium access added!`;
            
        } else if (promoCode.rewardType === 'points') {
            user.points += promoCode.rewardValue;
            rewardMessage = `${promoCode.rewardValue} Neural XP added!`;
            
        } else if (promoCode.rewardType === 'cash') {
            // Decrypt fields necessary if modifying encrypted data, but User.js handles it typically
            user.cashBalance += promoCode.rewardValue;
            user.totalMoney += promoCode.rewardValue;
            rewardMessage = `${promoCode.rewardValue} Cash added!`;
        }

        // Mark code as redeemed for this user
        if (!user.redeemedPromoCodes) {
            user.redeemedPromoCodes = [];
        }
        user.redeemedPromoCodes.push(promoCode.code);
        await user.save();

        // Increment usage count on the promo code
        promoCode.usedCount += 1;
        await promoCode.save();

        res.status(200).json({ 
            success: true, 
            message: `Promo code applied successfully. ${rewardMessage}`,
            user: { plan: user.plan, points: user.points, cashBalance: user.cashBalance, subscription: user.subscription }
        });
    } catch (error) {
        next(error);
    }
};
