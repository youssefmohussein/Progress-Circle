const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { fieldEncryption } = require('mongoose-field-encryption');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Never returned in queries by default
        },
        avatar: {
            type: String,
            default: '',
        },
        avatarConfig: {
            hair: { type: Number, default: 0 },
            shirt: { type: Number, default: 0 },
            pants: { type: Number, default: 0 },
            shoes: { type: Number, default: 0 },
            eyes: { type: Number, default: 0 },
            eyeColor: { type: Number, default: 0 },
            accessory: { type: Number, default: 0 },
            bg: { type: Number, default: 0 },
        },
        inventory: {
            type: [String],
            default: [],
        },
        trees: {
            type: [
                {
                    type: { type: String },
                    date: { type: Date },
                },
            ],
            default: [],
        },
        points: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
        lastTaskCompletionDate: {
            type: Date,
            default: null
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        savingsEnabled: {
            type: Boolean,
            default: false,
        },
        fitnessEnabled: {
            type: Boolean,
            default: false,
        },
        nutritionEnabled: {
            type: Boolean,
            default: false,
        },
        habitsEnabled: {
            type: Boolean,
            default: true,
        },
        totalMoney: {
            type: Number,
            default: 0,
        },
        cashBalance: {
            type: Number,
            default: 0,
        },
        creditBalance: {
            type: Number,
            default: 0,
        },
        monthlyIncome: {
            type: Number,
            default: 0,
        },
        savingsGoal: {
            type: Number,
            default: 50000,
        },
        gender: {
            type: String,
            enum: ['male', 'female', ''],
            default: '',
        }
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Apply encryption
userSchema.plugin(fieldEncryption, {
    fields: [
        'totalMoney',
        'cashBalance',
        'creditBalance',
        'monthlyIncome',
        'savingsGoal',
        'inventory',
    ],
    secret: process.env.DATABASE_ENCRYPTION_KEY,
    saltGenerator: (secret) => secret.slice(0, 16),
});

// Decrypt fields after retrieval
userSchema.post('init', (doc) => {
    try {
        doc.decryptFieldsSync();
    } catch (err) {
        // Already decrypted or failed
    }
});

// Decrypt fields after save
userSchema.post('save', (doc) => {
    try {
        doc.decryptFieldsSync();
    } catch (err) {
        // Already decrypted or failed
    }
});

module.exports = mongoose.model('User', userSchema);
