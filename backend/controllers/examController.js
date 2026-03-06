const Exam = require('../models/Exam');

const getExams = async (req, res, next) => {
    try {
        const exams = await Exam.find({ user: req.user._id }).sort({ examDate: 1 }).populate('course', 'title color');
        res.status(200).json({ success: true, count: exams.length, data: exams });
    } catch (error) { next(error); }
};

const createExam = async (req, res, next) => {
    try {
        const exam = await Exam.create({ ...req.body, user: req.user._id });
        res.status(201).json({ success: true, data: exam });
    } catch (error) { next(error); }
};

const updateExam = async (req, res, next) => {
    try {
        const exam = await Exam.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        ).populate('course', 'title color');
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.status(200).json({ success: true, data: exam });
    } catch (error) { next(error); }
};

const deleteExam = async (req, res, next) => {
    try {
        const exam = await Exam.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};

module.exports = { getExams, createExam, updateExam, deleteExam };
