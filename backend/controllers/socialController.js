const User = require('../models/User');
const Battle = require('../models/Battle');
const Notification = require('../models/Notification');
const Task = require('../models/Task');

// @desc    Search for users
// @route   GET /api/social/search
// @access  Private
exports.searchUsers = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(200).json({ success: true, data: [] });

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.user._id }
        })
        .select('name avatar avatarConfig points streak socialStats')
        .limit(10);

        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

// @desc    Follow a user
// @route   POST /api/social/follow/:id
// @access  Private
exports.followUser = async (req, res, next) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself." });
        }

        const userToFollow = await User.findById(req.params.id);
        if (!userToFollow) return res.status(404).json({ success: false, message: "User not found." });

        await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: req.params.id } });
        await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user._id } });

        res.status(200).json({ success: true, message: `Now following ${userToFollow.name}` });
    } catch (err) {
        next(err);
    }
};

// @desc    Unfollow a user
// @route   POST /api/social/unfollow/:id
// @access  Private
exports.unfollowUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
        await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });

        res.status(200).json({ success: true, message: "Unfollowed successfully" });
    } catch (err) {
        next(err);
    }
};

// @desc    Get social network (followers & following)
// @route   GET /api/social/network
// @access  Private
exports.getNetwork = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('followers', 'name avatar avatarConfig points streak socialStats')
            .populate('following', 'name avatar avatarConfig points streak socialStats');

        res.status(200).json({
            success: true,
            data: {
                followers: user.followers,
                following: user.following
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Send a Synergy Orb
// @route   POST /api/social/gift-orb
// @access  Private (Premium)
exports.sendSynergyOrb = async (req, res, next) => {
    try {
        if (req.user.plan !== 'premium') {
            return res.status(403).json({ success: false, message: "Synergy Orbs are a Premium feature!" });
        }

        const { recipientId } = req.body;
        const sender = await User.findById(req.user._id);
        
        if (sender.points < 500) {
            return res.status(400).json({ success: false, message: "Not enough points (Need 500)" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) return res.status(404).json({ success: false, message: "Recipient not found" });

        // Logic: Transfer points or grant a multiplier (simplified: grant recipient points)
        await User.findByIdAndUpdate(req.user._id, { 
            $inc: { points: -500, 'socialStats.orbsSent': 1 } 
        });
        await User.findByIdAndUpdate(recipientId, { 
            $inc: { points: 750, 'socialStats.synergyPoints': 100 } 
        });

        res.status(200).json({ success: true, message: `Synergy Orb deployed to ${recipient.name}!` });
    } catch (err) {
        next(err);
    }
};

// @desc    Invite a user to a Focus Battle
// @route   POST /api/social/battle/invite
// @access  Private (Pro)
exports.inviteToBattle = async (req, res, next) => {
    try {
        if (req.user.plan !== 'premium') {
            return res.status(403).json({ success: false, message: "Advanced Battles are for pro members!" });
        }

        const { opponentId, duration = 25, isMultiday = false, tasks = [] } = req.body;
        
        // Ensure mutual following if required (Simplified for now: just notified)
        const opponent = await User.findById(opponentId);
        if (!opponent) return res.status(404).json({ success: false, message: "Peer not found" });

        const battle = await Battle.create({
            participants: [
                { user: req.user._id, battleTasks: tasks },
                { user: opponentId }
            ],
            host: req.user._id,
            status: 'pending',
            durationMinutes: isMultiday ? 0 : duration,
            isMultiday
        });

        // Create Notification
        await Notification.create({
            recipient: opponentId,
            sender: req.user._id,
            type: 'battle_invite',
            refId: battle._id,
            message: `${req.user.name} challenged you to a Focus Battle!`
        });

        res.status(201).json({ success: true, data: battle });
    } catch (err) {
        next(err);
    }
};

// @desc    Accept/Reject Battle
// @route   POST /api/social/battle/respond/:id
// @access  Private
exports.respondToBattle = async (req, res, next) => {
    try {
        const { action } = req.body; // 'accept' or 'reject'
        const battle = await Battle.findById(req.params.id);
        
        if (!battle) return res.status(404).json({ success: false, message: "Battle session not found" });
        if (battle.participants[1].user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        if (action === 'accept') {
            if (battle.status === 'pending') {
                battle.status = 'active';
                battle.startTime = new Date();
                battle.endTime = battle.isMultiday ? null : new Date(Date.now() + battle.durationMinutes * 60000);
                
                battle.logs.push({
                    message: "Protocol Activated. Strategic alignment complete.",
                    timestamp: new Date()
                });

                await battle.save();
                
                // Only create join notification once if not already active
                const existingNotif = await Notification.findOne({
                    recipient: battle.host,
                    sender: req.user._id,
                    type: 'battle_accepted',
                    refId: battle._id
                });

                if (!existingNotif) {
                    await Notification.create({
                        recipient: battle.host,
                        sender: req.user._id,
                        type: 'battle_accepted',
                        refId: battle._id,
                        message: `${req.user.name} has entered the Arena!`
                    });
                }
            }
        } else {
            battle.status = 'cancelled';
            await battle.save();
        }

        // Mark notification as handled
        await Notification.findOneAndUpdate(
            { refId: battle._id, recipient: req.user._id },
            { status: action === 'accept' ? 'accepted' : 'rejected' }
        );

        res.status(200).json({ success: true, data: battle });
    } catch (err) {
        next(err);
    }
};

// @desc    Host Controls: Pause/Resume/End
// @route   PATCH /api/social/battle/control/:id
// @access  Private (Host)
exports.controlBattle = async (req, res, next) => {
    try {
        const { action } = req.body; // 'pause', 'resume', 'end'
        const battle = await Battle.findById(req.params.id);

        if (battle.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Only the host can control battle state" });
        }

        if (action === 'pause') {
            battle.status = 'paused';
            battle.paused = true;
            battle.breakSessions.push({ start: new Date() });
        } else if (action === 'resume') {
            battle.status = 'active';
            battle.paused = false;
            // Close last break session
            const lastBreak = battle.breakSessions[battle.breakSessions.length - 1];
            if (lastBreak && !lastBreak.end) lastBreak.end = new Date();
        } else if (action === 'end') {
            battle.status = 'completed';
            battle.endTime = new Date();
        }

        await battle.save();
        res.status(200).json({ success: true, data: battle });
    } catch (err) {
        next(err);
    }
};

// @desc    Get All Notifications
// @route   GET /api/social/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id, status: 'pending' })
            .populate('sender', 'name avatar')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user productivity trajectory
// @route   GET /api/social/trajectory/:id
// @access  Private
exports.getTrajectory = async (req, res, next) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

        // Mock data for 7 days if history is empty to ensure visual polish
        let history = targetUser.socialStats?.dailyPoints || [];
        if (history.length < 7) {
            const now = new Date();
            const mockHistory = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                // Base on current points with some variance
                const points = Math.max(0, targetUser.points - (i * 200) + Math.floor(Math.random() * 100));
                mockHistory.push({ date, points });
            }
            history = mockHistory;
        }

        res.status(200).json({ success: true, data: history });
    } catch (err) {
        next(err);
    }
};

// Utility to decrypt task if needed
const ensureDecrypted = (task) => {
    if (task && typeof task.decryptFieldsSync === 'function') {
        try {
            task.decryptFieldsSync();
        } catch (e) {
            // Already decrypted or failure
        }
    }
    return task;
};

// @desc    Get single battle details
// @route   GET /api/social/battle/:id
// @access  Private
exports.getBattle = async (req, res, next) => {
    try {
        const battle = await Battle.findById(req.params.id)
            .populate('participants.user', 'name avatar')
            .populate('participants.battleTasks')
            .populate('messages.sender', 'name avatar');
        
        if (!battle) return res.status(404).json({ success: false, message: "Battle not found" });

        // Ensure all populated tasks are decrypted
        battle.participants.forEach(p => {
            p.battleTasks = p.battleTasks.map(t => ensureDecrypted(t));
        });

        res.status(200).json({ success: true, data: battle });
    } catch (err) {
        next(err);
    }
};

// @desc    Send chat message in battle
// @route   POST /api/social/battle/chat/:id
// @access  Private
exports.sendBattleMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const battle = await Battle.findById(req.params.id);
        
        if (!battle) return res.status(404).json({ success: false, message: "Battle not found" });

        const isParticipant = battle.participants.some(p => p.user.toString() === req.user._id.toString());
        if (!isParticipant) return res.status(403).json({ success: false, message: "Unauthorized signal transmission" });

        battle.messages.push({
            sender: req.user._id,
            message: message
        });

        await battle.save();
        
        const updatedBattle = await Battle.findById(battle._id)
            .populate('participants.user', 'name avatar')
            .populate('participants.battleTasks')
            .populate('messages.sender', 'name avatar');

        res.status(200).json({ success: true, data: updatedBattle });
    } catch (err) {
        next(err);
    }
};

// @desc    Get active battles for current user
exports.getActiveBattles = async (req, res, next) => {
    try {
        const battles = await Battle.find({
            participants: { $elemMatch: { user: req.user._id } },
            status: { $in: ['active', 'paused', 'pending'] }
        }).populate('participants.user', 'name avatar');
        
        res.status(200).json({ success: true, data: battles });
    } catch (err) {
        next(err);
    }
};

// @desc    Get discoverable active battles
// @route   GET /api/social/battle/discover
// @access  Private
exports.getDiscoverableBattles = async (req, res, next) => {
    try {
        const battles = await Battle.find({
            'participants.user': { $ne: req.user._id },
            status: 'active'
        }).populate('host', 'name avatar');
        
        res.status(200).json({ success: true, data: battles });
    } catch (err) {
        next(err);
    }
};

// @desc    Add task to active battle (Host can assign to anyone)
// @route   POST /api/social/battle/add-task/:id
// @access  Private
exports.addTaskToBattle = async (req, res, next) => {
    try {
        const { taskId, targetUserId } = req.body; // targetUserId optional, defaults to self
        const battle = await Battle.findById(req.params.id);
        
        if (!battle || battle.status === 'completed' || battle.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Arena is not active." });
        }

        const isHost = battle.host.toString() === req.user._id.toString();
        const effectiveTarget = isHost && targetUserId ? targetUserId : req.user._id;

        const participant = battle.participants.find(p => p.user.toString() === effectiveTarget.toString());
        if (!participant) return res.status(404).json({ success: false, message: "Target user is not in this Arena." });

        if (!participant.battleTasks.includes(taskId)) {
            participant.battleTasks.push(taskId);
            
            const task = await Task.findById(taskId);
            const targetUser = await User.findById(effectiveTarget);

            battle.logs.push({
                message: isHost && targetUserId && targetUserId !== req.user._id.toString() 
                    ? `Host assigned mission [${task?.title || 'Unknown'}] to ${targetUser?.name}`
                    : `${req.user.name} staked mission: [${task?.title || 'Unknown'}]`,
                timestamp: new Date()
            });
            
            await battle.save();
        }

        res.status(200).json({ success: true, data: battle });
    } catch (err) {
        next(err);
    }
};

// @desc    Extend battle time
// @route   PATCH /api/social/battle/extend/:id
// @access  Private (Host)
exports.extendBattleTime = async (req, res, next) => {
    try {
        const { minutes } = req.body;
        const battle = await Battle.findById(req.params.id);
        
        if (battle.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Only the host can adjust the temporal sequence." });
        }

        if (battle.status !== 'completed') {
            const currentEnd = battle.endTime ? new Date(battle.endTime) : new Date();
            battle.endTime = new Date(currentEnd.getTime() + minutes * 60000);
            
            battle.logs.push({
                message: `Temporal extension deployed: +${minutes} minutes.`,
                timestamp: new Date()
            });
            
            await battle.save();
        }

        res.status(200).json({ success: true, data: battle });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle task status within battle
// @route   PATCH /api/social/battle/toggle-task/:id
// @access  Private
exports.toggleTaskStatus = async (req, res, next) => {
    try {
        const { taskId } = req.body;
        const battle = await Battle.findById(req.params.id);
        
        const participant = battle.participants.find(p => p.user.toString() === req.user._id.toString());
        if (!participant) return res.status(403).json({ success: false, message: "Not a participant." });

        if (!participant.battleTasks.includes(taskId)) {
            return res.status(400).json({ success: false, message: "Task not staked in this arena." });
        }

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ success: false, message: "Task not found." });

        const oldStatus = task.status;
        const newStatus = oldStatus === 'completed' ? 'pending' : 'completed';
        
        task.status = newStatus;
        task.completedAt = newStatus === 'completed' ? new Date() : null;
        await task.save();

        // Update stats
        if (newStatus === 'completed') {
            participant.tasksCompleted += 1;
            participant.pointsEarned += 50; // Arena bonus
            
            battle.logs.push({
                message: `Target Neutralized: ${req.user.name} finished [${task.title}]`,
                timestamp: new Date()
            });
        } else {
            participant.tasksCompleted = Math.max(0, participant.tasksCompleted - 1);
            participant.pointsEarned = Math.max(0, participant.pointsEarned - 50);
        }

        await battle.save();
        res.status(200).json({ success: true, data: battle });
    } catch (err) {
        next(err);
    }
};

// @desc    Join an active battle
// @route   POST /api/social/battle/join/:id
// @access  Private
exports.joinBattle = async (req, res, next) => {
    try {
        const battle = await Battle.findById(req.params.id);
        if (!battle) return res.status(404).json({ success: false, message: "Arena not found." });

        const isAlreadyIn = battle.participants.some(p => p.user.toString() === req.user._id.toString());
        if (isAlreadyIn) return res.status(400).json({ success: false, message: "Identity already synced with this Arena." });

        battle.participants.push({ user: req.user._id });
        battle.logs.push({
            message: `${req.user.name} has breached the Arena perimeter!`,
            timestamp: new Date()
        });

        await battle.save();
        res.status(200).json({ success: true, data: battle });
    } catch (err) {
        next(err);
    }
};
