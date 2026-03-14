const express = require('express');
const { protect } = require('../middleware/auth');
const { getStatus, requireAdmin, getStats, getUsers, resetPoints, deleteUser, updateUser, rewardAll, getSettings, updateSettings, grantSubscription, getSubscriptionPricing, updateSubscriptionPricing } = require('../controllers/adminController');

const router = express.Router();

router.get('/status', getStatus); // Public status check

router.use(protect);    // Must be authenticated
router.use(requireAdmin); // Must be admin

router.get('/stats', getStats);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/reward-all', rewardAll);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.put('/users/:id/reset-points', resetPoints);
router.post('/users/:id/grant-subscription', grantSubscription);
router.delete('/users/:id', deleteUser);
router.get('/pricing', getSubscriptionPricing);
router.put('/pricing', updateSubscriptionPricing);

module.exports = router;
