const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Habit name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [300, 'Description cannot exceed 300 characters'],
            default: '',
        },
        streak: {
            type: Number,
            default: 0,
        },
        frequency: {
            type: Number,
            required: [true, 'Frequency (times per week) is required'],
            min: [1, 'Frequency must be at least 1'],
            max: [7, 'Frequency cannot exceed 7'],
        },
        duration: {
            type: Number, // In weeks
            required: [true, 'Duration (weeks) is required'],
            min: [1, 'Duration must be at least 1 week'],
        },
        completedDates: {
            type: [String], // Array of YYYY-MM-DD strings
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
