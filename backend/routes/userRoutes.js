const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { redeemPromoCode, removePromoCode } = require('../controllers/promoCodeController');

const router = express.Router();

router.use(protect); // All user routes require auth

router.route('/profile').get(getProfile).put(updateProfile);
router.post('/redeem-promo', redeemPromoCode);
router.delete('/remove-promo', removePromoCode);

module.exports = router;
