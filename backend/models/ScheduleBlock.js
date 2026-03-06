const mongoose = require('mongoose');

const scheduleBlockSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['lecture', 'gym', 'study', 'bus', 'other'],
            default: 'other',
        },
        startTime: {
            type: String, // 'HH:mm' format
            required: true,
        },
        endTime: {
            type: String, // 'HH:mm' format
            required: true,
        },
        daysOfWeek: {
            type: [Number], // 0 (Sunday) to 6 (Saturday)
            default: [],
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Date, // If not recurring, a specific date
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('ScheduleBlock', scheduleBlockSchema);
