const Course = require('../models/Course');

const getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) { next(error); }
};

const createCourse = async (req, res, next) => {
    try {
        const course = await Course.create({ ...req.body, user: req.user._id });
        res.status(201).json({ success: true, data: course });
    } catch (error) { next(error); }
};

const updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        res.status(200).json({ success: true, data: course });
    } catch (error) { next(error); }
};

const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };
