const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['focus', 'break', 'sleep'],
            default: 'focus',
        },
        classification: {
            type: String,
            required: true, // User must specify or create a sector (e.g., Uni, Bus, Sleep)
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            default: null,
        },
        duration: {
            type: Number, // in minutes
            default: 0,
        },
        notes: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
