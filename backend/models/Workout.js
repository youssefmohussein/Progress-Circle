const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        exercises: {
            type: [String],
            default: [],
        },
        duration: {
            type: Number, // in minutes
            default: 30,
        },
        calories: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
