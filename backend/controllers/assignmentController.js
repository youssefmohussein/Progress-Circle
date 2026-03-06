const Assignment = require('../models/Assignment');
const User = require('../models/User');

const getAssignments = async (req, res, next) => {
    try {
        // optionally populate course
        const assignments = await Assignment.find({ user: req.user._id }).sort({ deadline: 1 }).populate('course', 'title color');
        res.status(200).json({ success: true, count: assignments.length, data: assignments });
    } catch (error) { next(error); }
};

const createAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.create({ ...req.body, user: req.user._id });
        res.status(201).json({ success: true, data: assignment });
    } catch (error) { next(error); }
};

const updateAssignment = async (req, res, next) => {
    try {
        let assignment = await Assignment.findOne({ _id: req.params.id, user: req.user._id });
        if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

        const wasCompleted = assignment.status === 'Completed';
        const isNowCompleted = req.body.status === 'Completed';

        assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('course', 'title color');

        if (!wasCompleted && isNowCompleted) {
            // Award points for completing an assignment
            await User.findByIdAndUpdate(req.user._id, {
                $inc: { points: 25, completedAssignments: 1 }
            });
        }

        res.status(200).json({ success: true, data: assignment });
    } catch (error) { next(error); }
};

const deleteAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};

module.exports = { getAssignments, createAssignment, updateAssignment, deleteAssignment };
