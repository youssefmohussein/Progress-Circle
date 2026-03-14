const Nutrition = require('../models/Nutrition');

// @desc    Get nutrition data for a specific date
// @route   GET /api/nutrition/:date
// @access  Private
exports.getDailyNutrition = async (req, res, next) => {
    try {
        const { date } = req.params; // format YYYY-MM-DD
        let nutrition = await Nutrition.findOne({ userId: req.user.id, date });

        if (!nutrition) {
            // Create a default sync record if not found
            nutrition = await Nutrition.create({
                userId: req.user.id,
                date,
                meals: [],
                waterIntake: 0,
            });
        }

        res.status(200).json({
            success: true,
            data: nutrition,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add or update a meal
// @route   POST /api/nutrition/:date/meal
// @access  Private
exports.addMeal = async (req, res, next) => {
    try {
        const { date } = req.params;
        const { name, calories, protein, carbs, fats, time } = req.body;

        // Neural Firewall: Whitelisting
        const mealData = {
            name,
            calories: parseInt(calories) || 0,
            protein: parseInt(protein) || 0,
            carbs: parseInt(carbs) || 0,
            fats: parseInt(fats) || 0,
            time: time || new Date().toLocaleTimeString()
        };

        const nutrition = await Nutrition.findOne({ userId: req.user.id, date });
        if (!nutrition) {
            return res.status(404).json({ success: false, message: 'Neural log not found for this date.' });
        }

        nutrition.meals.push(mealData);
        await nutrition.save();

        res.status(200).json({
            success: true,
            data: nutrition,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update water intake
// @route   PUT /api/nutrition/:date/water
// @access  Private
exports.updateWater = async (req, res, next) => {
    try {
        const { date } = req.params;
        const { amount } = req.body; // e.g. 250 (ml)

        // Sanitize: force integer to prevent NoSQL manipulation
        const sanitizedAmount = parseInt(amount) || 0;

        const nutrition = await Nutrition.findOneAndUpdate(
            { userId: req.user.id, date },
            { $inc: { waterIntake: sanitizedAmount } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: nutrition,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a meal
// @route   DELETE /api/nutrition/:date/meal/:mealId
// @access  Private
exports.deleteMeal = async (req, res, next) => {
    try {
        const { date, mealId } = req.params;

        const nutrition = await Nutrition.findOne({ userId: req.user.id, date });
        if (!nutrition) {
            return res.status(404).json({ success: false, message: 'Neural log not found.' });
        }

        nutrition.meals = nutrition.meals.filter(m => m._id.toString() !== mealId);
        await nutrition.save();

        res.status(200).json({
            success: true,
            data: nutrition,
        });
    } catch (error) {
        next(error);
    }
};
