import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Trophy, Target, TrendingUp, Clock, CalendarDays, Brain, BellRing, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { PriorityBadge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
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

export function Dashboard() {
    const { user } = useAuth();
    const {
        tasks, habits, leaderboard,
        scheduleBlocks, assignments, exams
    } = useData();

    // The data context starts with these as null until fetched
    if (!tasks || !scheduleBlocks || !assignments) return <LoadingSpinner />;

    const todayStr = dayjs().format('YYYY-MM-DD');
    const todayDayIndex = dayjs().day(); // 0 is Sunday

    // Derived Data
    const todaysTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 4);
    const habitsToday = habits.filter((h) => h.completedDates?.includes(todayStr));
    const userRank = leaderboard.find((e) => e.user?.id === user?.id)?.rank || '—';
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    const todayBlocks = scheduleBlocks
        .filter(b => (!b.daysOfWeek || b.daysOfWeek.includes(todayDayIndex)))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const upcomingAssignments = assignments
        .filter(a => a.status !== 'Completed' && dayjs(a.deadline).isAfter(dayjs().subtract(1, 'day')))
        .sort((a, b) => dayjs(a.deadline).diff(dayjs(b.deadline)))
        .slice(0, 3);

    const upcomingExams = exams
        .filter(e => dayjs(e.examDate).isAfter(dayjs().subtract(1, 'day')))
        .sort((a, b) => dayjs(a.examDate).diff(dayjs(b.examDate)))
        .slice(0, 2);

    // Smart Suggestion Logic (Simple Demo)
    let suggestion = { title: "Ready for the day!", desc: "Take a moment to plan your tasks.", type: "neutral" };
    if (upcomingExams.length > 0 && dayjs(upcomingExams[0].examDate).diff(dayjs(), 'day') <= 3) {
        suggestion = { title: "Exam Approaching 🚨", desc: `${upcomingExams[0].title} is very soon. Prioritize studying today.`, type: "urgent" };
    } else if (todayBlocks.length > 0) {
        suggestion = { title: "Next Up 📅", desc: `${todayBlocks[0].title} starts at ${todayBlocks[0].startTime}.`, type: "info" };
    } else if (todaysTasks.length > 0) {
        suggestion = { title: "Task Focus 🎯", desc: `You have ${todaysTasks.length} tasks today. Let's knock out the first one!`, type: "action" };
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>
                        {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-sm text-muted mt-1">{quote}</p>
                </div>
            </motion.div>

            {/* Smart Suggestion Box */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} delay={0.1}
                className="pc-card relative overflow-hidden"
                style={{
                    background: suggestion.type === 'urgent' ? 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(244,63,94,0.05))'
                        : 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))',
                    border: suggestion.type === 'urgent' ? '1px solid rgba(244,63,94,0.2)' : '1px solid rgba(99,102,241,0.2)'
                }}
            >
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${suggestion.type === 'urgent' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${suggestion.type === 'urgent' ? 'text-rose-400' : 'text-indigo-400'}`}>
                            Smart Suggestion
                        </h3>
                        <p className="font-bold text-lg">{suggestion.title}</p>
                        <p className="text-sm text-muted">{suggestion.desc}</p>
                    </div>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Points" value={user?.points ?? 0} icon={Trophy} color="indigo" delay={0.0} />
                <StatCard label="Study Hours" value={user?.studyHours ?? 0} suffix="h" icon={Brain} color="purple" delay={0.05} />
                <StatCard label="Workout Streak" value={user?.workoutStreak ?? 0} suffix="d" icon={Flame} color="orange" delay={0.1} />
                <StatCard label="Leaderboard" value={`#${userRank}`} icon={TrendingUp} color="sky" delay={0.15} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Schedule & Academics */}
                <div className="space-y-6">
                    {/* Today's Schedule */}
                    <Card>
                        <div className="flex items-center gap-2 mb-5">
                            <CalendarDays size={20} className="text-indigo-500" />
                            <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Today's Schedule</h2>
                        </div>
                        {todayBlocks.length === 0 ? (
                            <EmptyState icon={Clock} title="Free Day" description="No classes or events scheduled for today." />
                        ) : (
                            <div className="relative border-l-2 border-white/10 ml-3 space-y-6">
                                {todayBlocks.map((block, i) => (
                                    <div key={i} className="relative pl-6">
                                        <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 shadow-sm" style={{ ringColor: 'var(--bg)' }}></div>
                                        <h3 className="font-bold">{block.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-muted mt-1">
                                            <span className="text-indigo-400 font-semibold">{block.startTime} - {block.endTime}</span>
                                            <span>•</span>
                                            <span className="uppercase tracking-wider">{block.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Upcoming Deadlines */}
                    <Card>
                        <div className="flex items-center gap-2 mb-5">
                            <BellRing size={20} className="text-rose-500" />
                            <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Upcoming Deadlines</h2>
                        </div>
                        {(upcomingAssignments.length === 0 && upcomingExams.length === 0) ? (
                            <EmptyState icon={CheckCircle2} title="All Clear" description="No pressing deadlines or exams soon." />
                        ) : (
                            <div className="space-y-3">
                                {upcomingExams.map(exam => (
                                    <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                        <div>
                                            <p className="text-sm font-bold text-rose-100">{exam.title}</p>
                                            <p className="text-xs text-rose-400 mt-0.5">{dayjs(exam.examDate).format('MMM D, h:mm A')}</p>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-500/20 px-2 py-1 rounded">Exam</span>
                                    </div>
                                ))}
                                {upcomingAssignments.map(assignment => (
                                    <div key={assignment.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div>
                                            <p className="text-sm font-bold">{assignment.title}</p>
                                            <p className="text-xs text-muted mt-0.5">Due {dayjs(assignment.deadline).format('MMM D, YYYY')}</p>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">Assignment</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Tasks & Habits */}
                <div className="space-y-6">
                    {/* Today's Tasks */}
                    <Card>
                        <div className="flex items-center gap-2 mb-5">
                            <CheckCircle2 size={20} className="text-indigo-500" />
                            <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Pending Tasks</h2>
                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold">
                                {todaysTasks.length} left
                            </span>
                        </div>
                        {todaysTasks.length === 0 ? (
                            <EmptyState icon={CheckCircle2} title="All caught up!" description="No pending tasks today. 🎉" />
                        ) : (
                            <div className="space-y-2.5">
                                {todaysTasks.map((task) => (
                                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 transition-colors">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-orange-400' : 'bg-green-500'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{task.title}</p>
                                            {task.deadline && (
                                                <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                                                    <Clock size={11} /> Due {dayjs(task.deadline).format('MMM D')}
                                                </p>
                                            )}
                                        </div>
                                        <PriorityBadge priority={task.priority} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Habit Tracker */}
                    <Card>
                        <div className="flex items-center gap-2 mb-5">
                            <Flame size={20} className="text-orange-500 animate-streak" />
                            <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Habits</h2>
                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">
                                {habitsToday.length}/{habits.length} done
                            </span>
                        </div>
                        {habits.length === 0 ? (
                            <EmptyState icon={Flame} title="No habits yet" description="Add habits to track your daily routines." />
                        ) : (
                            <div className="space-y-3">
                                {habits.slice(0, 5).map((habit) => {
                                    const done = habit.completedDates?.includes(todayStr);
                                    return (
                                        <div key={habit.id} className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${done ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-muted bg-white/5'}`}>
                                                {done ? '✓' : '○'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate" style={{ color: done ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
                                                    {habit.name}
                                                </p>
                                                <p className="text-xs text-muted">{habit.streak} day streak 🔥</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}