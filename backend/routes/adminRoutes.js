const express = require('express');
const { protect } = require('../middleware/auth');
const { requireAdmin, getStats, getUsers, resetPoints, deleteUser } = require('../controllers/adminController');

const router = express.Router();

router.use(protect);    // Must be authenticated
router.use(requireAdmin); // Must be admin

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/reset-points', resetPoints);
router.delete('/users/:id', deleteUser);

module.exports = router;
