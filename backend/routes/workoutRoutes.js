const express = require('express');
const router = express.Router();
const { getWorkouts, createWorkout, updateWorkout, deleteWorkout } = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getWorkouts)
    .post(createWorkout);

router.route('/:id')
    .put(updateWorkout)
    .delete(deleteWorkout);

module.exports = router;
