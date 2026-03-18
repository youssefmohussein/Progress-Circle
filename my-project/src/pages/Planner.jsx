import { useState, useMemo, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';

import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    Clock, Plus, X, Layout, Target, Activity
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'sonner';
import { PageInsight } from '../components/PageInsight';

dayjs.extend(isBetween);

const EVENT_COLORS = {
    task: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
    habit: { bg: 'bg-[var(--accent)]/10', text: 'text-[var(--accent)]', border: 'border-[var(--accent)]/20' },
    session: { bg: 'bg-[var(--primary)]/10', text: 'text-[var(--primary)]', border: 'border-[var(--primary)]/20' },
    plan: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
};

export function Planner() {
    const { calendarEvents = [], addCalendarBlock, fetchCalendarEvents } = useData();
    useSEO('Tactical Planner', 'Plan your week with time-blocked focus sessions. ProgressCircle helps you schedule deep work and achieve more.');
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const [isAddingBlock, setIsAddingBlock] = useState(false);
    const [loading, setLoading] = useState(true);

    const [newBlock, setNewBlock] = useState({
        title: '',
        type: 'focus',
        startTime: '',
        endTime: '',
        notes: ''
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const start = currentDate.startOf('month').toISOString();
                const end = currentDate.endOf('month').toISOString();
                if (fetchCalendarEvents) {
                    await fetchCalendarEvents(start, end);
                }
            } catch (err) {
                console.error('Planner load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [currentDate, fetchCalendarEvents]);

    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = currentDate.startOf('month').day();
    const days = useMemo(() => {
        const arr = [];
        const prevMonth = currentDate.subtract(1, 'month');
        const prevMonthDays = prevMonth.daysInMonth();
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            arr.push({ date: prevMonth.date(prevMonthDays - i), currentMonth: false });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            arr.push({ date: currentDate.date(i), currentMonth: true });
        }
        const remaining = 42 - arr.length;
        const nextMonth = currentDate.add(1, 'month');
        for (let i = 1; i <= remaining; i++) {
            arr.push({ date: nextMonth.date(i), currentMonth: false });
        }
        return arr;
    }, [currentDate, firstDayOfMonth, daysInMonth]);

    const getDayEvents = (date) => {
        if (!calendarEvents) return [];
        return calendarEvents.filter(event =>
            dayjs(event.start).isSame(date, 'day')
        );
    };

    const handleNextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
    const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));

    const handleAddBlock = async () => {
        if (!newBlock.title || !newBlock.startTime || !newBlock.endTime) {
            return toast.error('Please fill in all required fields');
        }
        try {
            const startStr = `${selectedDate.format('YYYY-MM-DD')}T${newBlock.startTime}`;
            const endStr = `${selectedDate.format('YYYY-MM-DD')}T${newBlock.endTime}`;

            await addCalendarBlock({
                ...newBlock,
                startTime: dayjs(startStr).toISOString(),
                endTime: dayjs(endStr).toISOString()
            });
            toast.success('Focus block scheduled! 🚀');
            setIsAddingBlock(false);
            setNewBlock({ title: '', type: 'focus', startTime: '', endTime: '', notes: '' });
        } catch (error) {
            toast.error('Failed to schedule block');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black pc-gradient-text tracking-tight flex items-center gap-3">
                            <CalendarIcon className="text-[var(--primary)]" size={32} />
                            Universe Planner
                        </h1>
                        <PageInsight 
                            title="Tactical Scheduler"
                            intro="Visualize and allocate your cognitive resources across the temporal matrix. Coordinate complex deadlines with daily execution windows."
                            operations={[
                                { title: 'Temporal Visualization', content: 'Review your week-at-a-glance to identify high-density operational periods.' },
                                { title: 'Resource Allocation', content: 'Assign tasks to specific time slots to ensure mission-critical completion.' },
                                { title: 'Conflict Resolution', content: 'Identify and mitigate overlapping objectives before they compromise your trajectory.' }
                            ]}
                            neuralTip="Front-loading your tactical planning (Sundays) reduces 'Decision Fatigue' by up to 60% during active work cycles."
                        />
                    </div>
                    <p className="text-muted text-sm font-medium mt-1 uppercase tracking-widest">
                        Syncing your goals, habits & time
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-black uppercase tracking-widest px-4 min-w-[140px] text-center">
                        {currentDate.format('MMMM YYYY')}
                    </span>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <Card className="p-0 overflow-hidden border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                <div className="grid grid-cols-7 border-b border-gray-100 dark:border-slate-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-4 text-center text-[11px] font-black text-muted uppercase tracking-[0.2em]">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-6 h-[700px]">
                    {days.map((day, idx) => {
                        const dayEvents = getDayEvents(day.date);
                        const isToday = day.date.isSame(dayjs(), 'day');
                        const isSelected = selectedDate && day.date.isSame(selectedDate, 'day');

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    setSelectedDate(day.date);
                                    setIsDayModalOpen(true);
                                    setIsAddingBlock(false);
                                }}
                                className={`relative p-2 border-r border-b border-gray-100 dark:border-slate-800 cursor-pointer transition-all hover:bg-[var(--primary)]/5
                                    ${!day.currentMonth ? 'bg-gray-50/50 dark:bg-slate-900/20 opacity-30' : ''}
                                    ${isSelected ? 'bg-[var(--primary)]/10 ring-2 ring-inset ring-[var(--primary)]/30' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-lg transition-colors
                                        ${isToday ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30' : 'text-slate-400'}
                                    `}>
                                        {day.date.date()}
                                    </span>
                                    {dayEvents.length > 0 && (
                                        <span className="text-[9px] font-black text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                            {dayEvents.length}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-2 space-y-1 overflow-hidden h-20">
                                    {dayEvents.slice(0, 3).map((event, eIdx) => (
                                        <div
                                            key={eIdx}
                                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold truncate border ${EVENT_COLORS[event.type]?.bg} ${EVENT_COLORS[event.type]?.text} ${EVENT_COLORS[event.type]?.border}`}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[8px] text-muted font-bold text-center pt-1 animate-pulse">
                                            + {dayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Day Details Modal */}
            <Modal
                open={isDayModalOpen}
                onClose={() => {
                    setIsDayModalOpen(false);
                    setTimeout(() => setSelectedDate(null), 300); // Clear after animation
                }}
                title={selectedDate?.format('dddd, MMMM D')}
            >
                {selectedDate && (
                    <div className="space-y-6">
                        {!isAddingBlock ? (
                            <>
                                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {getDayEvents(selectedDate).length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl">
                                            <p className="text-muted font-bold uppercase tracking-widest text-xs">No entries for this date</p>
                                        </div>
                                    ) : (
                                        getDayEvents(selectedDate).map((event, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50/50 dark:bg-slate-800/20 rounded-2xl border border-gray-100 dark:border-slate-800">
                                                <div className={`p-3 rounded-xl ${EVENT_COLORS[event.type]?.bg} ${EVENT_COLORS[event.type]?.text}`}>
                                                    {event.type === 'task' && <Layout size={20} />}
                                                    {event.type === 'habit' && <Activity size={20} />}
                                                    {event.type === 'session' && <Clock size={20} />}
                                                    {event.type === 'plan' && <Target size={20} />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-sm">{event.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-black uppercase text-muted tracking-widest">
                                                            {dayjs(event.start).format('HH:mm')}
                                                            {event.end && event.type !== 'task' && event.type !== 'habit' && ` - ${dayjs(event.end).format('HH:mm')}`}
                                                        </span>
                                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${EVENT_COLORS[event.type]?.bg} ${EVENT_COLORS[event.type]?.text}`}>
                                                            {event.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <Button className="w-full flex items-center justify-center gap-2 pc-btn-primary" onClick={() => setIsAddingBlock(true)}>
                                    <Plus size={18} /> Add Focus Block
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-black text-muted uppercase tracking-widest mb-2">Block Name</label>
                                    <input
                                        className="pc-input"
                                        placeholder="e.g. Deep Work: Algorithm prep"
                                        value={newBlock.title}
                                        onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-muted uppercase tracking-widest mb-2">Start</label>
                                        <input
                                            type="time"
                                            className="pc-input"
                                            value={newBlock.startTime}
                                            onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-muted uppercase tracking-widest mb-2">End</label>
                                        <input
                                            type="time"
                                            className="pc-input"
                                            value={newBlock.endTime}
                                            onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-muted uppercase tracking-widest mb-2">Strategic Notes</label>
                                    <textarea
                                        className="pc-input min-h-[100px] resize-none"
                                        placeholder="What are the specific outputs for this block?"
                                        value={newBlock.notes}
                                        onChange={(e) => setNewBlock({ ...newBlock, notes: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button className="flex-1 h-12" onClick={handleAddBlock}>Sync with Universe</Button>
                                    <Button variant="secondary" onClick={() => setIsAddingBlock(false)}>Cancel</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
