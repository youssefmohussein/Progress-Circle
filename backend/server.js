require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const maintenanceMiddleware = require('./middleware/maintenanceMiddleware');
const { startExpireJob } = require('./jobs/expireSubscriptions');

// Route imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const habitRoutes = require('./routes/habitRoutes');
const goalRoutes = require('./routes/goalRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const fitnessRoutes = require('./routes/fitnessRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const socialRoutes = require('./routes/socialRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigin = process.env.FRONTEND_URL?.replace(/\/$/, '') || 'http://localhost:5173';

app.use(
    cors({
        origin: allowedOrigin,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ─── Raw body parser for PayMob webhook (MUST be before express.json) ────────
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
    if (req.body && Buffer.isBuffer(req.body)) {
        try { req.body = JSON.parse(req.body.toString()); } catch (e) { /* ignore */ }
    }
    next();
});

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);
app.use(maintenanceMiddleware); // Apply after auth-check or limiters? 
// Wait, maintenance needs req.user for admin check. It must be after 'protect' for most routes.
// But some routes don't have 'protect' yet. 
// Let's place it here, but maintenanceMiddleware itself needs to handle null user.

// Stricter limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many login attempts, please try again later.' },
});
app.use('/api/auth', authLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Progress Circle API is running.' });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/ai', aiRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server (with auto port fallback) ────────────────────────────────
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        // Start subscription expiration cron job
        startExpireJob();
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            throw err;
        }
    });
};

const PORT = parseInt(process.env.PORT) || 5000;
startServer(PORT);
