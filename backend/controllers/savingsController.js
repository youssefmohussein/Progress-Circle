const Transaction = require('../models/Transaction');
const User = require('../models/User');

const updateSavingsConfig = async (req, res, next) => {
    try {
        const { totalMoney, monthlyIncome, cashBalance, creditBalance } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { totalMoney, monthlyIncome, cashBalance, creditBalance },
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
        const { type, amount, category, description, fromWho, account, date } = req.body;
        const transaction = await Transaction.create({
            user: req.user._id,
            type,
            amount,
            category,
            description,
            fromWho,
            account: account || 'cash',
            date: date || Date.now()
        });

        const balanceField = (account === 'credit') ? 'creditBalance' : 'cashBalance';

        if (type === 'income') {
            updatedUser = await User.findByIdAndUpdate(req.user._id, {
                $inc: { totalMoney: amount, [balanceField]: amount }
            }, { new: true });
        } else if (type === 'expense' || type === 'investment') {
            updatedUser = await User.findByIdAndUpdate(req.user._id, {
                $inc: { totalMoney: -amount, [balanceField]: -amount }
            }, { new: true });
        }

        res.status(201).json({ success: true, data: transaction, user: updatedUser });
    } catch (error) {
        next(error);
    }
};

module.exports = { updateSavingsConfig, getTransactions, addTransaction };
