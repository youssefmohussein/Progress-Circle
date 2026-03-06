const FitnessCycle = require('../models/Workout');
const BodyMetric = require('../models/BodyMetric');

const setupCycle = async (req, res, next) => {
    try {
        const { cycleType, daysCount, daysConfig } = req.body;

        // Deactivate old cycles
        await FitnessCycle.updateMany({ user: req.user._id }, { active: false });

        const newCycle = await FitnessCycle.create({
            user: req.user._id,
            cycleType,
            daysCount,
            daysConfig,
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
        const { date, isRestDay, workoutCompleted, routineDone, weight, meals, notes } = req.body;

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
            routineDone,
            weight,
            meals,
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

const addBodyMetric = async (req, res, next) => {
    try {
        const metricData = { ...req.body, user: req.user._id };
        const metric = await BodyMetric.create(metricData);
        res.status(201).json({ success: true, data: metric });
    } catch (error) {
        next(error);
    }
};

const getBodyMetrics = async (req, res, next) => {
    try {
        const metrics = await BodyMetric.find({ user: req.user._id }).sort({ date: 1 });
        res.status(200).json({ success: true, data: metrics });
    } catch (error) {
        next(error);
    }
};

const deleteFitnessLog = async (req, res, next) => {
    try {
        const { logId } = req.params;
        const cycle = await FitnessCycle.findOne({ user: req.user._id, active: true });
        if (!cycle) return res.status(404).json({ success: false, message: 'No active cycle' });
        cycle.logs = cycle.logs.filter(log => log._id.toString() !== logId);
        await cycle.save();
        res.status(200).json({ success: true, message: 'Log deleted', data: cycle });
    } catch (error) {
        next(error);
    }
};

const deleteBodyMetric = async (req, res, next) => {
    try {
        const { id } = req.params;
        await BodyMetric.findOneAndDelete({ _id: id, user: req.user._id });
        res.status(200).json({ success: true, message: 'Metric deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { setupCycle, getCycle, logDailyFitness, addBodyMetric, getBodyMetrics, deleteFitnessLog, deleteBodyMetric };
