import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { Plus, CalendarDays, Clock, MapPin, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const BLOCK_TYPES = ['Class', 'Study', 'Workout', 'Free Time', 'Other'];

export function Schedule() {
    const { scheduleBlocks, addScheduleBlock, deleteScheduleBlock } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Default to today
    const [activeDay, setActiveDay] = useState(new Date().getDay());

    const toggleDaySelection = (dayIndex) => {
        if (selectedDays.includes(dayIndex)) {
            setSelectedDays(selectedDays.filter(d => d !== dayIndex));
        } else {
            setSelectedDays([...selectedDays, dayIndex]);
        }
    };

    // Filter blocks for the active day and sort by start time
    const activeBlocks = scheduleBlocks
        .filter(block => !block.daysOfWeek || block.daysOfWeek.includes(activeDay))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const getTypeColor = (blockType) => {
        switch (blockType) {
            case 'Class': return 'indigo';
            case 'Study': return 'purple';
            case 'Workout': return 'emerald';
            case 'Free Time': return 'sky';
            default: return 'gray';
        }
    };

    // Calculate Free Time for the active day
    // Formula: 24 hours - (Sleep: 8 + sum of active blocks durations)
    const calculateTotalMinutes = (blocks) => {
        return blocks.reduce((acc, b) => {
            const [sH, sM] = b.startTime.split(':').map(Number);
            const [eH, eM] = b.endTime.split(':').map(Number);
            const startMins = sH * 60 + sM;
            const endMins = eH * 60 + eM;
            return acc + (endMins - startMins > 0 ? endMins - startMins : 0);
        }, 0);
    };

    const scheduledMinutes = calculateTotalMinutes(activeBlocks);
    const sleepMinutes = 8 * 60;
    const freeMinutes = (24 * 60) - sleepMinutes - scheduledMinutes;
    const freeHours = Math.max(0, (freeMinutes / 60)).toFixed(1);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Weekly Schedule</h1>
                    <p className="text-sm text-muted mt-1">Plan your week and analyze your free time.</p>
                </div>
            </div>

            {/* Days Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                {DAYS.map((day, index) => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(index)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeDay === index
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-white/5 text-muted hover:bg-white/10'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Free Time Analyzer */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="pc-card p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-indigo-400">8.0h</span>
                    <span className="text-xs text-muted uppercase tracking-wider mt-1">Sleep</span>
                </div>
                <div className="pc-card p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-rose-400">{(scheduledMinutes / 60).toFixed(1)}h</span>
                    <span className="text-xs text-muted uppercase tracking-wider mt-1">Scheduled</span>
                </div>
                <div className="pc-card p-4 flex flex-col items-center justify-center text-center border border-emerald-500/30" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
                    <span className="text-2xl font-bold text-emerald-400">{freeHours}h</span>
                    <span className="text-xs font-bold text-emerald-500/70 uppercase tracking-wider mt-1">Free Time</span>
                </div>
            </div>

            {/* Blocks List */}
            {activeBlocks.length === 0 ? (
                <div className="pc-card text-center py-12 flex flex-col items-center justify-center text-muted">
                    <CalendarDays size={48} className="mb-4 opacity-50" />
                    <p>No events scheduled for {DAYS[activeDay]}.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {activeBlocks.map((block, idx) => {
                            const color = getTypeColor(block.type);
                            return (
                                <motion.div
                                    key={block.id || idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="pc-card relative overflow-hidden flex flex-col sm:flex-row sm:items-center gap-4"
                                >
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: `var(--color-${color}-500, #6366f1)` }} />

                                    <div className="min-w-[120px] shrink-0">
                                        <div className="text-lg font-bold">{block.startTime}</div>
                                        <div className="text-sm text-muted">to {block.endTime}</div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg mb-1">{block.title}</h3>
                                        <span style={{ color: `var(--color-${color}-400, #818cf8)` }} className="text-xs font-semibold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">
                                            {block.type}
                                        </span>
                                    </div>

                                    <button onClick={() => deleteScheduleBlock(block.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors text-xs self-start sm:self-center mt-2 sm:mt-0">
                                        Remove
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

        </div>
    );
}
