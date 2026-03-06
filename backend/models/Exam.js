const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Exam title is required'],
            trim: true,
        },
        examDate: {
            type: Date,
            required: true,
        },
        topics: {
            type: [String],
            default: [],
        },
        preparationProgress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
