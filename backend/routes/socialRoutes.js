const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    searchUsers,
    followUser,
    unfollowUser,
    getNetwork,
    sendSynergyOrb,
    getTrajectory,
    inviteToBattle,
    respondToBattle,
    controlBattle,
    addTaskToBattle,
    sendBattleMessage,
    extendBattleTime,
    toggleTaskStatus,
    joinBattle,
    getDiscoverableBattles,
    getActiveBattles,
    getBattle,
    getNotifications,
    clearSynergyData
} = require('../controllers/socialController');

router.get('/search', protect, searchUsers);
router.get('/network', protect, getNetwork);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);
router.post('/gift-orb', protect, sendSynergyOrb);
router.delete('/clear-synergy', protect, clearSynergyData);
router.post('/battle/invite', protect, inviteToBattle);
router.get('/battle/active', protect, getActiveBattles);
router.get('/battle/discover', protect, getDiscoverableBattles);
router.post('/battle/add-task/:id', protect, addTaskToBattle);
router.post('/battle/chat/:id', protect, sendBattleMessage);
router.post('/battle/join/:id', protect, joinBattle);
router.post('/battle/respond/:id', protect, respondToBattle);
router.patch('/battle/control/:id', protect, controlBattle);
router.patch('/battle/extend/:id', protect, extendBattleTime);
router.patch('/battle/toggle-task/:id', protect, toggleTaskStatus);
router.get('/battle/:id', protect, getBattle);
router.get('/notifications', protect, getNotifications);
router.get('/trajectory/:id', protect, getTrajectory);

module.exports = router;
