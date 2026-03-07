import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Flame, Trophy, Target, TrendingUp, Clock, CalendarDays, Brain, BellRing, Sparkles, Timer, PieChart, BarChart3, ArrowRight, Zap, Coffee, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { PriorityBadge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { WeeklyInsights } from '../components/WeeklyInsights';
import { FocusClock } from '../components/FocusClock';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const QUOTES = [
    'Great work today!',
    'Consistency builds greatness.',
    'One more step forward.',
    'Small habits, extraordinary results.',
    'You\'re making progress every day.',
];


function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function getCountdown(deadline) {
    const now = dayjs();
    const then = dayjs(deadline);
    const diff = then.diff(now);
    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    let timeStr = "";
    if (days > 0) timeStr = `${days} days ${hours} hours`;
    else if (hours > 0) timeStr = `${hours} hours ${minutes} minutes`;
    else timeStr = `${minutes} minutes`;

    if (diff <= 0) return `Overdue by ${timeStr}`;
    return timeStr;
}

export function Dashboard() {
    const { user } = useAuth();
    const {
        tasks, categories, leaderboard, sessions
    } = useData();

    if (!tasks || !categories || !leaderboard || !sessions) return <LoadingSpinner />;

    // Stats & Insights - Use Sessions for real analytics
    const completedTasks = tasks.filter(t => t.status === 'completed');

    // Focus time: Only 'focus' sessions
    const focusSessions = sessions.filter(s => s.type === 'focus');
    const totalTimeSpent = focusSessions.reduce((acc, s) => acc + (s.duration || 0), 0);

    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    const estimatedTimeRemaining = pendingTasks.reduce((acc, t) => acc + (t.estimatedTime || 0), 0);

    // Focus & Free Time Calculation
    const DAILY_BUDGET = 960; // 16h focus budget
    const todaySessions = sessions.filter(s => dayjs(s.startTime).isSame(dayjs(), 'day'));
    const focusToday = todaySessions.filter(s => s.type === 'focus').reduce((acc, s) => acc + (s.duration || 0), 0);
    const spentToday = focusToday;
    const freeTimeToday = Math.max(0, DAILY_BUDGET - spentToday);

    // Productivity Predictions
    let prediction = { title: "On Track", desc: "Your workload fits within available time.", type: "success" };
    if (estimatedTimeRemaining > freeTimeToday) {
        prediction = { title: "Heavy Workload", desc: "Pending tasks might exceed your available free time today.", type: "warning" };
    } else if (pendingTasks.filter(t => !t.parentId).length > 5) {
        prediction = { title: "Busy Day Ahead", desc: "Focus on your high-priority tasks first to stay productive.", type: "info" };
    }

    // "Top Priority Nodes" - Strictly tasks ending within 48 hours
    const urgentTasks = tasks
        .filter(t => t.status !== 'completed' && t.deadline && dayjs(t.deadline).diff(dayjs(), 'hour') <= 48)
        .sort((a, b) => dayjs(a.deadline).diff(dayjs(b.deadline)));

    // Activity Calculation
    const activities = useMemo(() => {
        const items = [];
        // Completed tasks today
        tasks.filter(t => t.status === 'completed' && dayjs(t.completedAt).isSame(dayjs(), 'day')).forEach(t => {
            items.push({
                title: 'Task Completed',
                description: t.title,
                timestamp: t.completedAt,
                type: 'success'
            });
        });
        // Sessions today
        sessions.filter(s => dayjs(s.startTime).isSame(dayjs(), 'day')).forEach(s => {
            items.push({
                title: `${s.type.charAt(0).toUpperCase() + s.type.slice(1)} Session`,
                description: `${s.classification} - ${s.duration} mins`,
                timestamp: s.startTime,
                type: 'info'
            });
        });
        return items.sort((a, b) => dayjs(b.timestamp).diff(dayjs(a.timestamp)));
    }, [tasks, sessions]);

    const taskProgress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    const nextDeadlineTask = tasks.filter(t => t.status !== 'completed' && t.deadline).sort((a, b) => dayjs(a.deadline).diff(dayjs(b.deadline)))[0];

    const todaysTasks = urgentTasks.slice(0, 6);
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest">Premium System</span>
                        <span className="text-pc-muted text-[10px] font-black uppercase tracking-widest">•</span>
                        <span className="text-pc-muted text-[10px] font-black uppercase tracking-widest">{dayjs().format('MMMM D, YYYY')}</span>
                    </div>
                    <h1 className="font-black pc-gradient-text page-title leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
                        {getGreeting()}, {user?.name || 'User'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/focus">
                        <Button className="rounded-full px-5 h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 border-none">
                            <Zap size={16} className="fill-current" /> Focus Mode
                        </Button>
                    </Link>
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-pc-muted">Current Streak</p>
                        <p className="text-lg font-black flex items-center gap-1 justify-end pc-streak-glow">{user?.streak || 0} <Flame size={16} className="text-orange-500" /></p>
                    </div>
                </div>
            </motion.div>

            {/* Today Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Main Progress Brain */}
                <Card className="md:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Brain size={120} />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                                <Zap size={18} />
                            </div>
                            <h2 className="text-lg font-black">Today Intelligence</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-pc-muted mb-1">Tasks Done</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black">{completedTasks.length}/{tasks.length}</span>
                                    <span className="text-xs font-bold text-green-500">+{tasks.filter(t => t.status === 'completed' && dayjs(t.completedAt).isSame(dayjs(), 'day')).length} today</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-pc-muted mb-1">Focus Energy</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black">{Math.floor(focusToday / 60)}h {focusToday % 60}m</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-pc-muted">
                            <span>Efficiency Meter</span>
                            <span>{Math.round(taskProgress)}%</span>
                        </div>
                        <ProgressBar progress={taskProgress} size="md" color="indigo" />
                    </div>
                </Card>

                {/* Smart Time Suggestion */}
                <Card className="flex flex-col justify-between border-l-4 border-l-indigo-500 bg-indigo-500/5">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={16} className="text-indigo-500" />
                            <h3 className="text-xs font-black uppercase tracking-widest">Smart Suggestion</h3>
                        </div>
                        <p className="font-bold text-sm leading-snug">
                            {estimatedTimeRemaining > freeTimeToday
                                ? "You have a heavy workload. Focus on high-priority items first."
                                : `You have ${Math.floor(freeTimeToday / 60)}h free today. Perfect for "Deep Work" on ${nextDeadlineTask?.title || 'your goals'}.`}
                        </p>
                    </div>

                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 mt-4 hover:gap-3 transition-all">
                        View Planner <ArrowRight size={12} />
                    </button>
                </Card>

                {/* Next Deadline Card */}
                <Card className={`flex flex-col justify-between ${nextDeadlineTask && dayjs(nextDeadlineTask.deadline).diff(dayjs(), 'hour') < 24 ? 'border-l-4 border-l-rose-500 bg-rose-500/5' : ''}`}>
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-pc-muted">
                            <Clock size={16} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Next Critical</h3>
                        </div>
                        {nextDeadlineTask ? (
                            <>
                                <p className="font-black text-lg line-clamp-1">{nextDeadlineTask.title}</p>
                                <p className={`text-xs font-bold mt-1 ${dayjs(nextDeadlineTask.deadline).diff(dayjs(), 'hour') < 24 ? 'text-rose-500' : 'text-pc-muted'}`}>
                                    {getCountdown(nextDeadlineTask.deadline)} left
                                </p>
                            </>
                        ) : (
                            <p className="text-xs font-bold text-pc-muted">No upcoming deadlines.</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Focus & Activity */}
                <div className="lg:col-span-4 space-y-8">
                    <FocusClock />

                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Activity size={18} className="text-indigo-500" />
                                <h2 className="text-sm font-black uppercase tracking-widest">Activity Timeline</h2>
                            </div>
                        </div>
                        <ActivityTimeline activities={activities} />
                    </Card>
                </div>

                {/* Right Column - Tasks & Visualization */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Weekly Performance */}
                    <Card>
                        <WeeklyInsights tasks={tasks} sessions={sessions} />
                    </Card>

                    {/* Priority Tasks */}
                    <Card className="relative">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">Focus Tasks</h2>
                                    <p className="text-xs text-pc-muted font-medium">Critical items requiring immediate attention</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="h-9 px-4 text-xs">View All</Button>
                        </div>

                        {todaysTasks.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="font-black text-lg">System Optimized</h3>
                                <p className="text-xs text-pc-muted mt-1 max-w-[200px]">All critical tasks for today have been resolved.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {todaysTasks.map(task => (
                                    <motion.div
                                        key={task.id || task._id}
                                        whileHover={{ y: -2 }}
                                        className={`p-4 rounded-2xl border bg-white/5 transition-all flex flex-col justify-between min-h-[100px] hover:border-indigo-500/30 group ${dayjs(task.deadline).diff(dayjs(), 'hour') < 12 ? 'border-rose-500/20 bg-rose-500/5' : 'border-white/5'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'}`} />
                                                <PriorityBadge priority={task.priority} />
                                            </div>
                                            {task.estimatedTime && (
                                                <span className="flex items-center gap-1 text-[10px] font-black text-pc-muted uppercase tracking-widest">
                                                    <Timer size={10} /> {task.estimatedTime}m
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{task.title}</h4>
                                        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-pc-muted">
                                            <CalendarDays size={10} /> {getCountdown(task.deadline)}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Insights Mini Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="flex items-center gap-4 bg-gradient-to-br from-indigo-500/10 to-transparent">
                            <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-pc-muted">Total Points</h3>
                                <p className="text-2xl font-black">{user?.points || 0}</p>
                            </div>
                        </Card>
                        <Card className="flex items-center gap-4 bg-gradient-to-br from-orange-500/10 to-transparent">
                            <div className="p-3 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                                <Flame size={20} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-pc-muted">Current Streak</h3>
                                <p className="text-2xl font-black">{user?.streak || 0} Days</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
