const User = require('../models/User');
const Session = require('../models/Session');
const Workout = require('../models/Workout');
const Goal = require('../models/Goal');

// ─── Static Shop Catalogue ────────────────────────────────────────────────────
// Items are referenced by a composite key: "{category}_{index}"
// The index matches the SVG asset index on the frontend.
const SHOP_ITEMS = {
    hair: [
        { id: 'hair_0', name: 'Default', price: 0 },
        { id: 'hair_1', name: 'Curly', price: 150 },
        { id: 'hair_2', name: 'Wavy', price: 150 },
        { id: 'hair_3', name: 'Spiky', price: 200 },
        { id: 'hair_4', name: 'Long', price: 200 },
        { id: 'hair_5', name: 'Mohawk', price: 300 },
        { id: 'hair_6', name: 'Bob', price: 150 },
        { id: 'hair_7', name: 'Ponytail', price: 200 },
        { id: 'hair_8', name: 'Braids', price: 250 },
        { id: 'hair_9', name: 'Updo', price: 200 },
        { id: 'hair_10', name: 'Fade', price: 200 },
        { id: 'hair_11', name: 'Buzz Cut', price: 150 }
    ],
    shirt: [
        { id: 'shirt_0', name: 'Basic Tee', price: 0 },
        { id: 'shirt_1', name: 'Hoodie', price: 200 },
        { id: 'shirt_2', name: 'Polo', price: 200 },
        { id: 'shirt_3', name: 'Jacket', price: 350 },
        { id: 'shirt_4', name: 'Gym Outfit', price: 500, milestone: 'workout_50' },
        { id: 'shirt_5', name: 'Legendary Hoodie', price: 800, milestone: 'streak_30' },
        { id: 'shirt_6', name: 'Suit', price: 600 },
        { id: 'shirt_7', name: 'Dress', price: 600 },
        { id: 'shirt_8', name: 'Sweater', price: 300 },
        { id: 'shirt_9', name: 'V-Neck', price: 150 },
        { id: 'shirt_10', name: 'Crop Top', price: 200 },
        { id: 'shirt_11', name: 'Tank Top', price: 150 }
    ],
    eyes: [
        { id: 'eyes_0', name: 'Default', price: 0 },
        { id: 'eyes_1', name: 'Happy', price: 100 },
        { id: 'eyes_2', name: 'Cool', price: 100 },
        { id: 'eyes_3', name: 'Sleepy', price: 150 },
        { id: 'eyes_4', name: 'Winking', price: 150 },
        { id: 'eyes_5', name: 'Surprised', price: 150 },
        { id: 'eyes_6', name: 'Starry', price: 300 },
        { id: 'eyes_7', name: 'Cute', price: 200 },
        { id: 'eyes_8', name: 'Angry', price: 150 }
    ],
    eyeColor: [
        { id: 'eyeColor_0', name: 'Dark Brown', price: 0 },
        { id: 'eyeColor_1', name: 'Hazel', price: 0 },
        { id: 'eyeColor_2', name: 'Blue', price: 150 },
        { id: 'eyeColor_3', name: 'Green', price: 150 },
        { id: 'eyeColor_4', name: 'Gray', price: 200 },
        { id: 'eyeColor_5', name: 'Amber', price: 200 },
        { id: 'eyeColor_6', name: 'Violet', price: 350 },
        { id: 'eyeColor_7', name: 'Red', price: 400 },
        { id: 'eyeColor_8', name: 'Gold', price: 500 },
    ],
    accessory: [
        { id: 'accessory_0', name: 'None', price: 0 },
        { id: 'accessory_1', name: 'Glasses', price: 200 },
        { id: 'accessory_2', name: 'Sunglasses', price: 250 },
        { id: 'accessory_3', name: 'Headband', price: 200 },
        { id: 'accessory_4', name: 'Rare Glasses', price: 0, milestone: 'points_5000' },
        { id: 'accessory_5', name: 'Crown', price: 0, milestone: 'goals_10' },
        { id: 'accessory_6', name: 'Headphones', price: 400 },
        { id: 'accessory_7', name: 'Beanie', price: 250 },
        { id: 'accessory_8', name: 'Mask', price: 150 },
        { id: 'accessory_9', name: 'Earrings', price: 300 },
        { id: 'accessory_10', name: 'Necklace', price: 300 },
        { id: 'accessory_11', name: 'Scarf', price: 200 }
    ],
    bg: [
        { id: 'bg_0', name: 'Gradient Blue', price: 0 },
        { id: 'bg_1', name: 'Sunset', price: 150 },
        { id: 'bg_2', name: 'Forest', price: 150 },
        { id: 'bg_3', name: 'Galaxy', price: 300 },
        { id: 'bg_4', name: 'Gold', price: 500 },
        { id: 'bg_5', name: 'Cyberpunk', price: 400 },
        { id: 'bg_6', name: 'Neon', price: 400 },
        { id: 'bg_7', name: 'Mint', price: 200 },
        { id: 'bg_8', name: 'Crimson', price: 300 }
    ],
    pants: [
        { id: 'pants_0', name: 'Basic Jeans', price: 0 },
        { id: 'pants_1', name: 'Shorts', price: 150 },
        { id: 'pants_2', name: 'Sweatpants', price: 200 },
        { id: 'pants_3', name: 'Skirt', price: 150 },
        { id: 'pants_4', name: 'Suit Pants', price: 400 },
        { id: 'pants_5', name: 'Cargo Pants', price: 300 }
    ],
    shoes: [
        { id: 'shoes_0', name: 'Basic Sneakers', price: 0 },
        { id: 'shoes_1', name: 'Running Shoes', price: 200 },
        { id: 'shoes_2', name: 'Boots', price: 300 },
        { id: 'shoes_3', name: 'Slippers', price: 100 },
        { id: 'shoes_4', name: 'Dress Shoes', price: 400 },
        { id: 'shoes_5', name: 'Sandals', price: 150 }
    ],
    powerups: [
        { id: 'powerup_freeze', name: 'Streak Freeze', price: 500, desc: 'Protects your streak if you miss a day.' }
    ]
};

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
        const { hair, shirt, pants, shoes, eyes, eyeColor, accessory, bg } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const inventory = Array.from(new Set([...DEFAULT_FREE_ITEMS, ...(user.inventory || [])]));

        // Validate equipped items are owned
        const toCheck = [
            { cat: 'hair', val: hair },
            { cat: 'shirt', val: shirt },
            { cat: 'pants', val: pants },
            { cat: 'shoes', val: shoes },
            { cat: 'eyes', val: eyes },
            { cat: 'eyeColor', val: eyeColor },
            { cat: 'accessory', val: accessory },
            { cat: 'bg', val: bg },
        ];
        for (const { cat, val } of toCheck) {
            if (val === undefined) continue;
            const itemId = `${cat}_${val}`;
            if (!inventory.includes(itemId)) {
                return res.status(403).json({ success: false, message: `Item ${itemId} is not in your inventory.` });
            }
        }

        user.avatarConfig = {
            hair: hair ?? user.avatarConfig?.hair ?? 0,
            shirt: shirt ?? user.avatarConfig?.shirt ?? 0,
            pants: pants ?? user.avatarConfig?.pants ?? 0,
            shoes: shoes ?? user.avatarConfig?.shoes ?? 0,
            eyes: eyes ?? user.avatarConfig?.eyes ?? 0,
            eyeColor: eyeColor ?? user.avatarConfig?.eyeColor ?? 0,
            accessory: accessory ?? user.avatarConfig?.accessory ?? 0,
            bg: bg ?? user.avatarConfig?.bg ?? 0,
        };
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

        console.log(`[BUY_ITEM] User ${user.email} attempting to buy ${itemId} for ${item.price} pts`);
        console.log(`[BUY_ITEM] Current points: ${user.points}, Current inventory length: ${(user.inventory || []).length}`);

        if (itemId === 'powerup_freeze') {
            if (user.plan !== 'premium') {
                return res.status(403).json({ success: false, message: 'Streak Freezes are a Premium-only feature.' });
            }
            user.points -= item.price;
            user.streakFreezes += 1;
            await user.save();
            console.log(`[BUY_ITEM] Powerup Freeze bought successfully`);
        } else {
            user.points -= item.price;
            if (!user.inventory) user.inventory = [];
            user.inventory.push(itemId);
            await user.save();
            console.log(`[BUY_ITEM] Item bought! New points: ${user.points}, New inv length: ${user.inventory.length}`);
            console.log(`[BUY_ITEM] Does new inventory include ${itemId}?: ${user.inventory.includes(itemId)}`);
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
