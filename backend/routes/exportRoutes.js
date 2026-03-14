const express = require('express');
const { exportPDF } = require('../controllers/exportController');
const { protect } = require('../middleware/auth');
const { requirePremium } = require('../middleware/premiumMiddleware');

const router = express.Router();

// Route requires authentication and premium status
router.use(protect);
router.use(requirePremium);

router.get('/pdf', exportPDF);

module.exports = router;
