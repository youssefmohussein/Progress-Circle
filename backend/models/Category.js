const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxlength: [50, 'Category name cannot exceed 50 characters'],
        },
        color: {
            type: String,
            default: '#4f46e5', // Indigo default
        },
        icon: {
            type: String,
            default: 'Tag',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
