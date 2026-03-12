const express = require('express');
const { setupCycle, getCycle, logDailyFitness, addBodyMetric, getBodyMetrics, deleteFitnessLog, deleteBodyMetric } = require('../controllers/fitnessController');
const { protect } = require('../middleware/auth');
const { requirePremium } = require('../middleware/premiumMiddleware');

const router = express.Router();

router.use(protect, requirePremium);

router.route('/cycle').get(getCycle).post(setupCycle);
router.route('/log').post(logDailyFitness);
router.route('/log/:logId').delete(deleteFitnessLog);
router.route('/metrics').get(getBodyMetrics).post(addBodyMetric);
router.route('/metrics/:id').delete(deleteBodyMetric);

module.exports = router;
