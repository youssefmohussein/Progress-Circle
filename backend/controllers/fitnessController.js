const FitnessCycle = require('../models/Workout');

const setupCycle = async (req, res, next) => {
    try {
        const { cycleType, daysCount } = req.body;

        // Deactivate old cycles
        await FitnessCycle.updateMany({ user: req.user._id }, { active: false });

        const newCycle = await FitnessCycle.create({
            user: req.user._id,
            cycleType,
            daysCount,
            active: true
        });

        res.status(201).json({ success: true, data: newCycle });
    } catch (error) {
        next(error);
    }
};

const getCycle = async (req, res, next) => {
    try {
        const cycle = await FitnessCycle.findOne({ user: req.user._id, active: true });
        res.status(200).json({ success: true, data: cycle });
    } catch (error) {
        next(error);
    }
};

const logDailyFitness = async (req, res, next) => {
    try {
        const { date, isRestDay, workoutCompleted, foodEaten, notes } = req.body;

        let cycle = await FitnessCycle.findOne({ user: req.user._id, active: true });

        if (!cycle) {
            return res.status(404).json({ success: false, message: 'No active fitness cycle found' });
        }

        const logDate = new Date(date).setHours(0, 0, 0, 0);
        const existingLogIndex = cycle.logs.findIndex(log => new Date(log.date).setHours(0, 0, 0, 0) === logDate);

        const logData = {
            date: new Date(date),
            isRestDay,
            workoutCompleted,
            foodEaten,
            notes
        };

        if (existingLogIndex > -1) {
            cycle.logs[existingLogIndex] = logData;
        } else {
            cycle.logs.push(logData);
        }

        await cycle.save();

        res.status(200).json({ success: true, data: cycle });
    } catch (error) {
        next(error);
    }
};

module.exports = { setupCycle, getCycle, logDailyFitness };
