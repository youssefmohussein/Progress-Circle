const express = require('express');
const router = express.Router();
const { 
    getDailyNutrition, 
    addMeal, 
    updateWater, 
    deleteMeal 
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/:date', getDailyNutrition);
router.post('/:date/meal', addMeal);
router.put('/:date/water', updateWater);
router.delete('/:date/meal/:mealId', deleteMeal);

module.exports = router;
