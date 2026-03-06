const ScheduleBlock = require('../models/ScheduleBlock');

const getBlocks = async (req, res, next) => {
    try {
        const blocks = await ScheduleBlock.find({ user: req.user._id }).sort({ startTime: 1 });
        res.status(200).json({ success: true, count: blocks.length, data: blocks });
    } catch (error) { next(error); }
};

const createBlock = async (req, res, next) => {
    try {
        const block = await ScheduleBlock.create({ ...req.body, user: req.user._id });
        res.status(201).json({ success: true, data: block });
    } catch (error) { next(error); }
};

const updateBlock = async (req, res, next) => {
    try {
        const block = await ScheduleBlock.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!block) return res.status(404).json({ success: false, message: 'Schedule block not found' });
        res.status(200).json({ success: true, data: block });
    } catch (error) { next(error); }
};

const deleteBlock = async (req, res, next) => {
    try {
        const block = await ScheduleBlock.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!block) return res.status(404).json({ success: false, message: 'Schedule block not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};

module.exports = { getBlocks, createBlock, updateBlock, deleteBlock };
