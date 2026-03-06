const mongoose = require('mongoose');

const learningSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tool: {
            type: String, // e.g., 'Duolingo', 'Coursera', 'Reading'
            required: true,
            trim: true,
        },
        progress: {
            type: String, // e.g., 'Completed Unit 3', 'Read Chapter 4'
            trim: true,
        },
        timeSpent: {
            type: Number, // in minutes
            default: 15,
        },
        streak: {
            type: Number,
            default: 0,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('LearningSession', learningSessionSchema);
