const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All user routes require auth

router.route('/profile').get(getProfile).put(updateProfile);

module.exports = router;
