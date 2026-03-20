const User = require('../models/User');
const Session = require('../models/Session');
const Workout = require('../models/Workout');
const Goal = require('../models/Goal');

// ─── Dynamic Shop Catalogue for Open Peeps ────────────────────────────────────
const avatarOptions = {
    head: [
        "short1", "afro", "bangs", "bangs2", "bantuKnots", "bear", "bun", "bun2", "buns", "cornrows", "cornrows2",
        "dreads1", "dreads2", "flatTop", "flatTopLong", "grayBun", "grayMedium", "grayShort", "hatBeanie",
        "hatHip", "hijab", "long", "longAfro", "longBangs", "longCurly", "medium1", "medium2", "medium3",
        "mediumBangs", "mediumBangs2", "mediumBangs3", "mediumStraight", "mohawk", "mohawk2", "noHair1",
        "noHair2", "noHair3", "pomp", "shaved1", "shaved2", "shaved3", "short2", "short3",
        "short4", "short5", "turban", "twists", "twists2"
    ],
    face: [
        "smile", "angryWithFang", "awe", "blank", "calm", "cheeky", "concerned", "concernedFear", "contempt",
        "cute", "cyclops", "driven", "eatingHappy", "explaining", "eyesClosed", "fear", "hectic",
        "lovingGrin1", "lovingGrin2", "monster", "old", "rage", "serious", "smileBig",
        "smileLOL", "smileTeethGap", "solemn", "suspicious", "tired", "veryAngry"
    ],
    facialHair: [
        "", "chin", "full", "full2", "full3", "full4", "goatee1", "goatee2", "moustache1", "moustache2",
        "moustache3", "moustache4", "moustache5", "moustache6", "moustache7", "moustache8", "moustache9"
    ],
    accessories: [
        "", "eyepatch", "glasses", "glasses2", "glasses3", "glasses4", "glasses5", "sunglasses", "sunglasses2"
    ],
    clothingColor: ["9ddadb", "e78276", "ffcf77", "fdea6b", "78e185", "8fa7df", "e279c7"],
    skinColor: ["ffdbb4", "edb98a", "d08b5b", "ae5d29", "694d3d"],
    headContrastColor: ["2c1b18", "e8e1e1", "ecdcbf", "d6b370", "f59797", "b58143", "a55728", "724133", "4a312c", "c93305"],
    backgroundColor: [
        "f3f4f6", "transparent", "fca5a5", "fcd34d", "86efac", "93c5fd", "c4b5fd", "f9a8d4",
        "1e293b", "0f172a", "4c1d95", "1e1b4b", "831843", "064e3b",
        "linear-gradient(135deg, #ff00ff, #00ffff)", // Cyberpunk
        "linear-gradient(135deg, #6366f1, #d946ef)", // Neon Nights
        "linear-gradient(135deg, #f59e0b, #ef4444)", // Tropical Heat
        "linear-gradient(135deg, #34d399, #3b82f6)", // Aurora Mix
        "linear-gradient(135deg, #0f172a, #334155, #1e293b)", // Deep Space
        "linear-gradient(135deg, #fbbf24, #d97706)", // Sunset Gold
        "linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)" // Rainbow Vapor
    ],
    farmTheme: ["classic", "winter", "cyberpunk", "desert", "newyork", "kyoto", "oasis"]
};

const GRADIENT_NAMES = {
    "linear-gradient(135deg, #ff00ff, #00ffff)": "Cyberpunk Mix",
    "linear-gradient(135deg, #6366f1, #d946ef)": "Neon Nights Mix",
    "linear-gradient(135deg, #f59e0b, #ef4444)": "Tropical Heat Mix",
    "linear-gradient(135deg, #34d399, #3b82f6)": "Aurora Mix",
    "linear-gradient(135deg, #0f172a, #334155, #1e293b)": "Deep Space Mix",
    "linear-gradient(135deg, #fbbf24, #d97706)": "Sunset Gold Mix",
    "linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)": "Rainbow Vapor Mix"
};

const formatName = (str) => {
    if (!str) return 'None';
    if (GRADIENT_NAMES[str]) return GRADIENT_NAMES[str];
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
};

const FREE_CATEGORIES = ['skinColor', 'clothingColor', 'headContrastColor', 'backgroundColor'];

const SHOP_ITEMS = {};
for (const [cat, items] of Object.entries(avatarOptions)) {
    SHOP_ITEMS[cat] = items.map((val, idx) => {
        const isGradient = cat === 'backgroundColor' && val.includes('gradient');
        return {
            id: isGradient ? `backgroundColor_mix_${idx}` : `${cat}_${val}`,
            name: formatName(val),
            price: (idx === 0 || val === '' || (FREE_CATEGORIES.includes(cat) && !isGradient)) ? 0 : 150, // default/empty/colors are free, gradients are 150
            val: val
        };
    });
}

// Ensure powerups remain available natively
SHOP_ITEMS.powerups = [
    { id: 'powerup_freeze', name: 'Streak Freeze', price: 500, desc: 'Protects your streak if you miss a day.' }
];


// Flat list of all items for easy lookup
const ALL_ITEMS = Object.values(SHOP_ITEMS).flat();

// ─── Static Milestone Definitions ────────────────────────────────────────────
const MILESTONES = [
    {
        id: 'focus_30',
        label: '30 Focus Sessions',
        description: 'Complete 30 focus sessions',
        reward: 'Pine Sapling (rare tree unlocked)',
        rewardTree: 'pine_rare',
        icon: '🌲',
    },
    {
        id: 'focus_100',
        label: '100 Focus Sessions',
        description: 'Complete 100 focus sessions',
        reward: 'Golden Tree',
        rewardTree: 'golden',
        icon: '✨',
    },
    {
        id: 'streak_7',
        label: '7-Day Streak',
        description: 'Maintain a 7-day task streak',
        reward: '+100 Bonus Points (auto-awarded)',
        icon: '🔥',
    },
    {
        id: 'streak_30',
        label: '30-Day Streak',
        description: 'Maintain a 30-day task streak',
        reward: 'Legendary Hoodie (Avatar Item)',
        rewardItem: 'shirt_5',
        icon: '🏆',
    },
    {
        id: 'points_5000',
        label: '5,000 Points',
        description: 'Accumulate 5,000 total points',
        reward: 'Rare Glasses (Avatar Item)',
        rewardItem: 'accessory_4',
        icon: '💎',
    },
    {
        id: 'workout_50',
        label: '50 Workouts',
        description: 'Complete 50 workout days',
        reward: 'Gym Outfit (Avatar Item)',
        rewardItem: 'shirt_4',
        icon: '💪',
    },
    {
        id: 'goals_10',
        label: '10 Goals Completed',
        description: 'Complete 10 goals',
        reward: 'Crown Accessory (Avatar Item)',
        rewardItem: 'accessory_5',
        icon: '👑',
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function computeMilestoneProgress(userId, user) {
    // Focus sessions count
    const focusCount = await Session.countDocuments({ userId, type: 'focus', isActive: false });

    // Workout days count (total across all cycles)
    const cycles = await Workout.find({ user: userId });
    const workoutCount = cycles.reduce((sum, c) =>
        sum + c.logs.filter(l => l.workoutCompleted).length, 0);

    // Completed goals count
    const goalsCount = await Goal.countDocuments({ userId, status: 'completed' });

    const progress = {
        focus_30: { current: focusCount, total: 30 },
        focus_100: { current: focusCount, total: 100 },
        streak_7: { current: user.streak, total: 7 },
        streak_30: { current: user.streak, total: 30 },
        points_5000: { current: user.points, total: 5000 },
        workout_50: { current: workoutCount, total: 50 },
        goals_10: { current: goalsCount, total: 10 },
    };

    return MILESTONES.map(m => ({
        ...m,
        current: progress[m.id]?.current ?? 0,
        total: progress[m.id]?.total ?? 1,
        unlocked: (progress[m.id]?.current ?? 0) >= (progress[m.id]?.total ?? 1),
    }));
}

// Items free by default (price === 0, no milestone required)
const DEFAULT_FREE_ITEMS = ALL_ITEMS.filter(i => i.price === 0 && !i.milestone).map(i => i.id);

// ─── Controllers ──────────────────────────────────────────────────────────────

// @desc  Get all gamification data for the logged-in user
// @route GET /api/gamification
// @access Private
exports.getGamificationData = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Merge default free items into inventory if not already there
        const inventory = Array.from(new Set([...DEFAULT_FREE_ITEMS, ...(user.inventory || [])]));

        const milestones = await computeMilestoneProgress(req.user._id, user);

        // Auto-grant milestone reward items that are now unlocked but not yet in inventory
        const newItems = [];
        for (const m of milestones) {
            if (m.unlocked && m.rewardItem && !inventory.includes(m.rewardItem)) {
                inventory.push(m.rewardItem);
                newItems.push(m.rewardItem);
            }
        }
        if (newItems.length > 0) {
            await User.findByIdAndUpdate(req.user._id, { $addToSet: { inventory: { $each: newItems } } });
        }

        res.status(200).json({
            success: true,
            data: {
                points: user.points,
                streak: user.streak,
                avatarConfig: user.avatarConfig,
                inventory,
                trees: user.trees || [],
                shopItems: SHOP_ITEMS,
                milestones,
                userPlan: user.plan,
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc  Save avatar config
// @route PUT /api/gamification/avatar
// @access Private
exports.saveAvatarConfig = async (req, res, next) => {
    try {
        const {
            seed, head, face, facialHair, accessories,
            clothingColor, skinColor, headContrastColor,
            backgroundColor, farmTheme
        } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const inventory = Array.from(new Set([...DEFAULT_FREE_ITEMS, ...(user.inventory || [])]));

        // Validate equipped items are owned
        const toCheck = [
            { cat: 'head', val: head },
            { cat: 'face', val: face },
            { cat: 'facialHair', val: facialHair },
            { cat: 'accessories', val: accessories },
            { cat: 'clothingColor', val: clothingColor },
            { cat: 'skinColor', val: skinColor },
            { cat: 'headContrastColor', val: headContrastColor },
            { cat: 'backgroundColor', val: backgroundColor },
            { cat: 'farmTheme', val: farmTheme }
        ];

        for (const { cat, val } of toCheck) {
            if (val === undefined || val === null) continue;

            // Resolve the actual ID from SHOP_ITEMS to handle custom IDs like gradients
            const shopItem = SHOP_ITEMS[cat]?.find(i => i.val === val);
            const itemId = shopItem ? shopItem.id : `${cat}_${val}`;

            if (!inventory.includes(itemId)) {
                return res.status(403).json({ success: false, message: `Item ${itemId} is not in your inventory.` });
            }
        }

        user.avatarConfig = { ...user.avatarConfig, ...req.body };
        await user.save();

        res.status(200).json({ success: true, data: { avatarConfig: user.avatarConfig } });
    } catch (err) {
        next(err);
    }
};

// @desc  Buy an item from the shop
// @route POST /api/gamification/buy
// @access Private
exports.buyItem = async (req, res, next) => {
    try {
        const { itemId } = req.body;
        const item = ALL_ITEMS.find(i => i.id === itemId);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        if (item.price === 0) return res.status(400).json({ success: false, message: 'This item is free – claim it from milestones.' });

        const user = await User.findById(req.user._id);
        const inventory = Array.from(new Set([...DEFAULT_FREE_ITEMS, ...(user.inventory || [])]));

        if (inventory.includes(itemId)) {
            return res.status(400).json({ success: false, message: 'You already own this item.' });
        }
        if (user.points < item.price) {
            return res.status(400).json({ success: false, message: `Not enough points. Need ${item.price}, you have ${user.points}.` });
        }


        if (itemId === 'powerup_freeze') {
            if (user.plan !== 'premium') {
                return res.status(403).json({ success: false, message: 'Streak Freezes are a Premium-only feature.' });
            }
            user.points -= item.price;
            user.streakFreezes += 1;
            await user.save();
        } else {
            user.points -= item.price;
            if (!user.inventory) user.inventory = [];
            user.inventory.push(itemId);
            await user.save();
        }

        res.status(200).json({ success: true, data: { itemId, pointsSpent: item.price } });
    } catch (err) {
        next(err);
    }
};

// @desc  Get community farm stats (total trees)
// @route GET /api/gamification/community
// @access Private
exports.getCommunityStats = async (req, res, next) => {
    try {
        const result = await User.aggregate([
            { $project: { treeCount: { $size: { $ifNull: ['$trees', []] } } } },
            { $group: { _id: null, totalTrees: { $sum: '$treeCount' } } },
        ]);
        const totalTrees = result[0]?.totalTrees ?? 0;
        res.status(200).json({ success: true, data: { totalTrees } });
    } catch (err) {
        next(err);
    }
};

// @desc  Get shop catalogue (public)
// @route GET /api/gamification/shop
// @access Private
exports.getShop = (req, res) => {
    res.status(200).json({ success: true, data: SHOP_ITEMS });
};

// @desc  TEST ONLY: Instantly grant a tree
// @route POST /api/gamification/test-tree
// @access Private
exports.testGrantTree = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const treeTypes = ['sapling', 'pine', 'oak', 'pine_rare', 'golden'];
        const randomTree = treeTypes[Math.floor(Math.random() * treeTypes.length)];

        const newTree = { type: randomTree, date: new Date() };

        await User.findByIdAndUpdate(user._id, {
            $push: { trees: newTree }
        });

        res.status(200).json({ success: true, message: `Granted a ${randomTree}!`, data: newTree });
    } catch (err) {
        next(err);
    }
};
