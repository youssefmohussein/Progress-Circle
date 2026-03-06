const LearningSession = require('../models/LearningSession');
const User = require('../models/User');

const getSessions = async (req, res, next) => {
    try {
        const sessions = await LearningSession.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: sessions.length, data: sessions });
    } catch (error) { next(error); }
};

const createSession = async (req, res, next) => {
    try {
        const session = await LearningSession.create({ ...req.body, user: req.user._id });

        // Award points for learning session and update study hours
        const hoursEarned = req.body.timeSpent ? (req.body.timeSpent / 60) : 0;
        await User.findByIdAndUpdate(req.user._id, {
            $inc: {
                points: 15,
                studyHours: Number(hoursEarned.toFixed(2))
            }
        });

        res.status(201).json({ success: true, data: session });
    } catch (error) { next(error); }
};

const updateSession = async (req, res, next) => {
    try {
        const session = await LearningSession.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!session) return res.status(404).json({ success: false, message: 'Learning session not found' });
        res.status(200).json({ success: true, data: session });
    } catch (error) { next(error); }
};

const deleteSession = async (req, res, next) => {
    try {
        const session = await LearningSession.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!session) return res.status(404).json({ success: false, message: 'Learning session not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};

module.exports = { getSessions, createSession, updateSession, deleteSession };
