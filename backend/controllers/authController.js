const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password });

        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    points: user.points,
                    streak: user.streak,
                    isAdmin: user.isAdmin,
                    studyHours: user.studyHours || 0,
                    completedAssignments: user.completedAssignments || 0,
                    workoutStreak: user.workoutStreak || 0,
                    joinedAt: user.createdAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    points: user.points,
                    streak: user.streak,
                    isAdmin: user.isAdmin,
                    studyHours: user.studyHours || 0,
                    completedAssignments: user.completedAssignments || 0,
                    workoutStreak: user.workoutStreak || 0,
                    joinedAt: user.createdAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = req.user;
    console.log('Backend getMe user:', { id: user._id, email: user.email, isAdmin: user.isAdmin });
    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            points: user.points,
            streak: user.streak,
            isAdmin: user.isAdmin,
            studyHours: user.studyHours || 0,
            completedAssignments: user.completedAssignments || 0,
            workoutStreak: user.workoutStreak || 0,
            joinedAt: user.createdAt,
        },
    });
};

module.exports = { register, login, getMe };
