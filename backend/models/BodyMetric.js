const mongoose = require('mongoose');

const bodyMetricSchema = new mongoose.Schema(
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
        weight: {
            type: Number, // optionally store in kg or lbs
        },
        bmr: {
            type: Number,
        },
        muscleMass: {
            type: Number, // Percentage or absolute
        },
        bodyFat: {
            type: Number, // Percentage
        },
        stomach: {
            type: Number, // Circumference (cm or inches)
        },
        arm: {
            type: Number,
        },
        leg: {
            type: Number,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('BodyMetric', bodyMetricSchema);
