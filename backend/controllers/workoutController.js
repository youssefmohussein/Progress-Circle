const Workout = require('../models/Workout');
const User = require('../models/User');

const getWorkouts = async (req, res, next) => {
    try {
        const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: workouts.length, data: workouts });
    } catch (error) { next(error); }
};

const createWorkout = async (req, res, next) => {
    try {
        const workout = await Workout.create({ ...req.body, user: req.user._id });

        // Award points for workout and increment workout streak
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { points: 10, workoutStreak: 1 }
        });

        res.status(201).json({ success: true, data: workout });
    } catch (error) { next(error); }
};

const updateWorkout = async (req, res, next) => {
    try {
        const workout = await Workout.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });
        res.status(200).json({ success: true, data: workout });
    } catch (error) { next(error); }
};

const deleteWorkout = async (req, res, next) => {
    try {
        const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};

module.exports = { getWorkouts, createWorkout, updateWorkout, deleteWorkout };
