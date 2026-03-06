import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Profile() {
    const { user } = useAuth();
    const { tasks } = useData();

    if (!user || !tasks) return <LoadingSpinner />;

    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

    return (
        <div className="space-y-5 max-w-3xl">
            {/* Profile header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pc-card">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                    <Avatar src={user.avatar} name={user.name} size="xl" />
                    <div className="flex-1">
                        <h2 style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)', fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: 700 }}>{user.name}</h2>
                        <p className="text-sm text-muted">{user.email}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-2 text-sm text-muted">
                            <span className="font-semibold text-indigo-500">{user.points || 0} pts</span>
                            <span className="hidden sm:inline">·</span>
                            <span>{user.streak || 0} day streak 🔥</span>
                            {joined && <><span className="hidden sm:inline">·</span><span className="text-xs">Since {joined}</span></>}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard label="Tasks Done" value={completedTasks} icon={Trophy} color="indigo" delay={0} />
                <StatCard label="Total Nodes" value={tasks.length} icon={Calendar} color="orange" delay={0.05} />
            </div>

            {/* Activity summary */}
            <Card>
                <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>Activity Summary</h3>
                <div className="space-y-3">
                    {[
                        { label: 'Total Tasks', value: tasks.length },
                        { label: 'Tasks Completed', value: completedTasks },
                        { label: 'Pending Nodes', value: tasks.length - completedTasks },
                    ].map((row, i) => (
                        <motion.div
                            key={row.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex justify-between items-center py-2.5 px-4 rounded-xl"
                            style={{ background: 'var(--color-surface-2)' }}
                        >
                            <span className="text-sm text-muted">{row.label}</span>
                            <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{row.value}</span>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
