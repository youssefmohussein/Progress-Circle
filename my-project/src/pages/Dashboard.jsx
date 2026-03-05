import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Trophy, Target, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { Card } from '../components/Card';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

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
    const { tasks, habits, goals, leaderboard } = useData();

    const loading = !tasks;
    if (loading) return <LoadingSpinner />;

    const todaysTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 5);
    const completedTasks = tasks.filter((t) => t.status === 'completed');
    const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 3);
    const today = new Date().toISOString().split('T')[0];
    const habitsToday = habits.filter((h) => h.completedDates?.includes(today));
    const userRank = leaderboard.find((e) => e.user?.id === user?.id)?.rank || '—';
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className="text-sm font-medium text-indigo-500 mb-1">{quote}</p>
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>
                    {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-sm text-muted mt-1">Ready to build momentum today?</p>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Current Streak" value={user?.streak ?? 0} suffix=" days" icon={Flame} color="orange" delay={0} />
                <StatCard label="Total Points" value={user?.points ?? 0} icon={Trophy} color="indigo" delay={0.05} />
                <StatCard label="Your Rank" value={`#${userRank}`} icon={TrendingUp} color="sky" delay={0.1} />
                <StatCard label="Tasks Done" value={completedTasks.length} icon={CheckCircle2} color="green" delay={0.15} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Tasks */}
                <Card>
                    <div className="flex items-center gap-2 mb-5">
                        <CheckCircle2 size={20} className="text-indigo-500" />
                        <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>
                            Today's Tasks
                        </h2>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-semibold dark:bg-indigo-900/30">
                            {todaysTasks.length} remaining
                        </span>
                    </div>
                    {todaysTasks.length === 0 ? (
                        <EmptyState icon={CheckCircle2} title="All caught up!" description="No pending tasks. Great work! 🎉" />
                    ) : (
                        <div className="space-y-2.5">
                            {todaysTasks.map((task) => (
                                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors" style={{ background: 'var(--color-surface-2)' }}>
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-orange-400' : 'bg-green-500'
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{task.title}</p>
                                        {task.deadline && (
                                            <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                                                <Clock size={11} /> Due {task.deadline}
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
                        <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>
                            Habit Tracker
                        </h2>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold dark:bg-green-900/30">
                            {habitsToday.length}/{habits.length} today
                        </span>
                    </div>
                    {habits.length === 0 ? (
                        <EmptyState icon={Flame} title="No habits yet" description="Add habits to track your daily routines." />
                    ) : (
                        <div className="space-y-3">
                            {habits.slice(0, 4).map((habit) => {
                                const done = habit.completedDates?.includes(today);
                                return (
                                    <div key={habit.id} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${done ? 'bg-green-500 text-white' : 'text-muted'
                                            }`} style={!done ? { background: 'var(--color-surface-2)' } : {}}>
                                            {done ? '✓' : '○'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{habit.name}</p>
                                            <p className="text-xs text-muted">{habit.streak} day streak 🔥</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>

            {/* Active Goals */}
            {activeGoals.length > 0 && (
                <Card>
                    <div className="flex items-center gap-2 mb-5">
                        <Target size={20} className="text-indigo-500" />
                        <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>
                            Active Goals
                        </h2>
                    </div>
                    <div className="space-y-5">
                        {activeGoals.map((goal) => (
                            <div key={goal.id}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{goal.title}</p>
                                    <span className="text-sm font-bold text-indigo-500">{goal.progress}%</span>
                                </div>
                                <ProgressBar progress={goal.progress} showLabel={false} />
                                {goal.targetDate && (
                                    <p className="text-xs text-muted mt-1">Target: {goal.targetDate}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}