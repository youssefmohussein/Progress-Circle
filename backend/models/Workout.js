const mongoose = require('mongoose');

const dailyFitnessLogSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    isRestDay: {
        type: Boolean,
        default: false,
    },
    workoutCompleted: {
        type: Boolean,
        default: false,
    },
    foodEaten: {
        type: String, // e.g., "Chicken, rice, eggs"
        default: '',
    },
    notes: {
        type: String,
        default: '',
    }
});

const fitnessCycleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cycleType: {
        type: String,
        // e.g., "Push/Pull/Legs", "Customized", "Bro Split"
        default: 'Customized'
    },
    daysCount: {
        type: Number,
        default: 7, // Default 7 day cycle
    },
    active: {
        type: Boolean,
        default: true
    },
    logs: [dailyFitnessLogSchema]
}, { timestamps: true });

module.exports = mongoose.model('FitnessCycle', fitnessCycleSchema);
