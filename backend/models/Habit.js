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
        completedDates: {
            type: [String], // Array of YYYY-MM-DD strings
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
