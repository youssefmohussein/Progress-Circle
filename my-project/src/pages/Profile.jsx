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
        <div className="space-y-6 max-w-3xl">
            {/* Profile header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pc-card">
                <div className="flex items-center gap-6">
                    <Avatar src={user.avatar} name={user.name} size="xl" />
                    <div>
                        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>{user.name}</h2>
                        <p className="text-sm text-muted">{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                            <span className="font-semibold text-indigo-500">{user.points || 0} pts</span>
                            <span>·</span>
                            <span>{user.streak || 0} day streak 🔥</span>
                            {joined && <><span>·</span><span>Member since {joined}</span></>}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
