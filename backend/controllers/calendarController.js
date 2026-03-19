const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Session = require('../models/Session');
const ScheduleBlock = require('../models/ScheduleBlock');
const dayjs = require('dayjs');

// @desc    Get all calendar events for a date range
// @route   GET /api/calendar
// @access  Private
const getCalendarEvents = async (req, res, next) => {
    try {
        const { start, end } = req.query;
        const userId = req.user._id;

        const startDate = start ? new Date(start) : dayjs().startOf('month').toDate();
        const endDate = end ? new Date(end) : dayjs().endOf('month').toDate();

        const [tasks, habits, sessions, scheduleBlocks] = await Promise.all([
            Task.find({
                userId,
                deadline: { $gte: startDate, $lte: endDate }
            }),

            Habit.find({
                userId,
                // We fetch habits that have completions, but we'll still need to filter dates in JS 
                // unless we use aggregation. Aggregation is better for performance.
            }),

            Session.find({
                userId,
                startTime: { $gte: startDate, $lte: endDate }
            }),

            ScheduleBlock.find({
                userId,
                startTime: { $gte: startDate, $lte: endDate }
            }).select('title startTime endTime type color notes')
        ]);

        const events = [];

        // 1. Tasks (Deadlines)
        tasks.forEach(task => {
            events.push({
                id: `task-${task._id}`,
                title: `Task: ${task.title}`,
                start: task.deadline,
                end: task.deadline,
                type: 'task',
                status: task.status,
                priority: task.priority,
                color: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981',
                allDay: false
            });
        });

        // 2. Habits (Completions) - Optimized filtering
        habits.forEach(habit => {
            if (!habit.completedDates) return;
            habit.completedDates.forEach(dateStr => {
                // Quick string comparison if possible, or date compare
                const d = dayjs(dateStr);
                if (d.isAfter(startDate) && d.isBefore(endDate) || d.isSame(startDate) || d.isSame(endDate)) {
                    events.push({
                        id: `habit-${habit._id}-${dateStr}`,
                        title: `Habit: ${habit.name}`,
                        start: d.toDate(),
                        end: d.toDate(),
                        type: 'habit',
                        color: habit.color || '#ec4899',
                        allDay: true
                    });
                }
            });
        });

        // 3. Sessions (Focus time)
        sessions.forEach(session => {
            let className = session.classification || 'Universal';
            if (className.length > 30 && className.includes(':')) {
                className = 'Universal';
            }
            events.push({
                id: `session-${session._id}`,
                title: `Focus: ${className}`,
                start: session.startTime,
                end: session.endTime || session.startTime,
                type: 'session',
                color: '#6366f1',
                allDay: false
            });
        });

        // 4. Schedule Blocks
        scheduleBlocks.forEach(block => {
            events.push({
                id: `block-${block._id}`,
                title: block.title,
                start: block.startTime,
                end: block.endTime,
                type: 'plan',
                color: block.color || '#3b82f6',
                allDay: false,
                notes: block.notes
            });
        });

        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a schedule block
// @route   POST /api/calendar/blocks
// @access  Private
const createScheduleBlock = async (req, res, next) => {
    try {
        const { title, startTime, endTime, type, color, notes } = req.body;
        const block = await ScheduleBlock.create({
            userId: req.user._id,
            title,
            startTime,
            endTime,
            type,
            color,
            notes
        });
        res.status(201).json({ success: true, data: block });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a schedule block
// @route   DELETE /api/calendar/blocks/:id
// @access  Private
const deleteScheduleBlock = async (req, res, next) => {
    try {
        const block = await ScheduleBlock.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!block) return res.status(404).json({ success: false, message: 'Block not found' });
        res.status(200).json({ success: true, message: 'Block deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCalendarEvents, createScheduleBlock, deleteScheduleBlock };
