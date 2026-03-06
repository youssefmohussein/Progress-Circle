const Category = require('../models/Category');

// @desc    Get all categories for logged-in user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ userId: req.user._id }).sort({ name: 1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
    try {
        const { name, color, icon } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

        const category = await Category.create({
            userId: req.user._id,
            name,
            color,
            icon,
        });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
