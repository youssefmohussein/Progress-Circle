const Notification = require('../models/Notification');

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort('-createdAt')
            .limit(50)
            .populate('sender', 'name avatar');

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { status: 'read' },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        res.status(200).json({
            success: true,
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, status: 'pending' },
            { status: 'read' }
        );

        res.status(200).json({
            success: true,
            message: 'All neural nodes cleared.',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.id,
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Notification node removed.',
        });
    } catch (error) {
        next(error);
    }
};

// Internal Helper to create system notifications
exports.createSystemNotification = async (recipientId, type, message, refId = null) => {
    try {
        await Notification.create({
            recipient: recipientId,
            sender: null,
            type,
            message,
            refId
        });
    } catch (error) {
        console.error('Failed to create system notification:', error);
    }
};
