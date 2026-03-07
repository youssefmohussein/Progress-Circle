const Session = require('../models/Session');
const User = require('../models/User');

// Determine tree type + points from duration (minutes)
function getSessionReward(duration) {
    if (duration >= 120) return { tree: 'oak', points: 40 };
    if (duration >= 50) return { tree: 'pine', points: 25 };
    if (duration >= 25) return { tree: 'sapling', points: 15 };
    return null; // too short – no reward
}

exports.startSession = async (req, res) => {
    try {
        // Deactivate any existing active sessions for this user
        await Session.updateMany({ userId: req.user.id, isActive: true }, { isActive: false, endTime: new Date() });

        const session = await Session.create({
            userId: req.user.id,
            startTime: new Date(),
            ...req.body,
            isActive: true
        });
        res.status(201).json({ status: 'success', data: { data: session } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.endSession = async (req, res) => {
    try {
        const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
        if (!session) return res.status(404).json({ status: 'fail', message: 'Session not found' });

        const endTime = new Date();
        const duration = Math.round((endTime - session.startTime) / (1000 * 60)); // in minutes

        session.isActive = false;
        session.endTime = endTime;
        session.duration = duration;
        session.notes = req.body.notes || session.notes;
        await session.save();

        // Award points + grow a tree (only for focus sessions of 25+ min)
        let treeAdded = null;
        if (session.type === 'focus') {
            const reward = getSessionReward(duration);
            if (reward) {
                await User.findByIdAndUpdate(req.user.id, {
                    $inc: { points: reward.points },
                    $push: { trees: { type: reward.tree, date: new Date() } },
                });
                treeAdded = reward.tree;
            }
        }

        res.status(200).json({ status: 'success', data: { data: session }, treeAdded });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getActiveSession = async (req, res) => {
    try {
        const session = await Session.findOne({ userId: req.user.id, isActive: true });
        res.status(200).json({ status: 'success', data: { data: session } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user.id }).sort('-startTime');
        res.status(200).json({ status: 'success', data: { data: sessions } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.createManualSession = async (req, res) => {
    try {
        const session = await Session.create({
            userId: req.user.id,
            ...req.body,
            isActive: false // Manual sessions are always completed
        });
        res.status(201).json({ status: 'success', data: { data: session } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
