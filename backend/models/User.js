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
            seed: { type: String, default: 'default' },
            head: { type: String, default: 'short1' },
            face: { type: String, default: 'smile' },
            facialHair: { type: String, default: '' },
            accessories: { type: String, default: '' },
            clothingColor: { type: String, default: '8fa7df' },
            skinColor: { type: String, default: 'edb98a' },
            headContrastColor: { type: String, default: '2c1b18' },
            backgroundColor: { type: String, default: 'transparent' },
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
        },
        themePreferences: {
            primaryColor: { type: String, default: '#6366f1' },
            accentColor: { type: String, default: '#8b5cf6' },
            bg: { type: String, default: '' },
            surface: { type: String, default: '' },
            mode: { type: String, default: 'dark' },
            glassmorphism: { type: Boolean, default: true },
        },
        musicPreferences: {
            platform: { type: String, default: '' },
            playlistUrl: { type: String, default: '' },
        },
        linkedAccounts: {
            spotify: { type: Boolean, default: false },
            anghami: { type: Boolean, default: false },
            apple: { type: Boolean, default: false },
        },
        streakHistory: {
            type: [Date],
            default: [],
        },
        streakFreezes: {
            type: Number,
            default: 0,
        },
        plan: {
            type: String,
            enum: ['free', 'premium'],
            default: 'free',
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
