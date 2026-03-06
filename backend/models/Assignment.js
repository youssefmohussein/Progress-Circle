const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
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
            required: [true, 'Assignment title is required'],
            trim: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        estimatedTimeHours: {
            type: Number,
            default: 1,
        },
        status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed'],
            default: 'Not Started',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
