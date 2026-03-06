const Transaction = require('../models/Transaction');
const User = require('../models/User');

const updateSavingsConfig = async (req, res, next) => {
    try {
        const { totalMoney, monthlyIncome } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { totalMoney, monthlyIncome },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (error) {
        next(error);
    }
};

const addTransaction = async (req, res, next) => {
    try {
        const { type, amount, category, description, date } = req.body;
        const transaction = await Transaction.create({
            user: req.user._id,
            type,
            amount,
            category,
            description,
            date: date || Date.now()
        });

        let updatedUser = req.user;
        // Optionally update user's total money
        if (type === 'expense') {
            updatedUser = await User.findByIdAndUpdate(req.user._id, {
                $inc: { totalMoney: -amount }
            }, { new: true });
        } else if (type === 'investment') {
            updatedUser = await User.findByIdAndUpdate(req.user._id, {
                $inc: { totalMoney: -amount } // assumes investment comes out of total money tracking
            }, { new: true });
        }

        res.status(201).json({ success: true, data: transaction, user: updatedUser });
    } catch (error) {
        next(error);
    }
};

module.exports = { updateSavingsConfig, getTransactions, addTransaction };
