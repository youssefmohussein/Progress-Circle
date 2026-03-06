const Session = require('../models/Session');

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

        res.status(200).json({ status: 'success', data: { data: session } });
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
