const express = require('express');
const { setupCycle, getCycle, logDailyFitness } = require('../controllers/fitnessController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/cycle').get(getCycle).post(setupCycle);
router.route('/log').post(logDailyFitness);

module.exports = router;
