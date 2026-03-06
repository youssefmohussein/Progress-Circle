const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['expense', 'investment'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        date: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
