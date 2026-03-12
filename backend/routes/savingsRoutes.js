const express = require('express');
const { updateSavingsConfig, getTransactions, addTransaction } = require('../controllers/savingsController');
const { protect } = require('../middleware/auth');
const { requirePremium } = require('../middleware/premiumMiddleware');

const router = express.Router();

router.use(protect, requirePremium);

router.route('/config').put(updateSavingsConfig);
router.route('/').get(getTransactions).post(addTransaction);

module.exports = router;
