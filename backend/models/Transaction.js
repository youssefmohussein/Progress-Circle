const mongoose = require('mongoose');
const { fieldEncryption } = require('mongoose-field-encryption');

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['expense', 'investment', 'income'],
            required: true,
        },
        account: {
            type: String,
            enum: ['cash', 'credit'],
            default: 'cash',
        },
        fromWho: {
            type: String,
            default: '', // Useful for income source or recipient
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

// Apply encryption
transactionSchema.plugin(fieldEncryption, {
    fields: ['fromWho', 'amount', 'category', 'description'],
    secret: process.env.DATABASE_ENCRYPTION_KEY,
    saltGenerator: (secret) => secret.slice(0, 16),
});

module.exports = mongoose.model('Transaction', transactionSchema);
