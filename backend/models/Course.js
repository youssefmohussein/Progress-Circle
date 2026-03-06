const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Course title is required'],
            trim: true,
        },
        instructor: {
            type: String,
            trim: true,
            default: '',
        },
        credits: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'dropped'],
            default: 'active',
        },
        color: {
            type: String,
            default: 'indigo', // For frontend UI
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
