import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useState } from 'react';
import api from '../api/client';
import { toast } from 'sonner';

export function Profile() {
    const { user, setUser } = useAuth();
    const { tasks } = useData();
    const [updating, setUpdating] = useState(false);

    if (!user || !tasks) return <LoadingSpinner />;

    const toggleModule = async (module) => {
        try {
            setUpdating(true);
            const res = await api.put('/users/profile', {
                [module]: !user[module]
            });
            // Update auth context directly if possible, or force reload/re-fetch
            // Assuming useAuth provides a way to update the user object. Let's mutate locally or rely on re-fetch.
            // If there's no updateContextUser function, reload page is a safe fallback for context sync.
            // Alternatively, wait if `login(res.data.data, token)` exists.
            if (res.data?.success) {
                setUser(res.data.data);
                toast.success('Module preferences updated.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update preferences');
        } finally {
            setUpdating(false);
        }
    };

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

            {/* System Modules - "The Brain" of your app */}
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <TrendingUp size={80} />
                </div>
                <h3 className="text-lg font-black mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>System Modules</h3>
                <p className="text-xs text-pc-muted mb-6">Activate specialized nodes to expand your productivity horizon.</p>

                <div className="space-y-3">
                    {[
                        { key: 'habitsEnabled', label: 'Habit Engine', desc: 'Core routine tracking and consistency loops.', icon: 'Repeat', core: true },
                        { key: 'savingsEnabled', label: 'Financial Tracking', desc: 'Track savings, income, and critical expenses.', icon: 'Wallet' },
                        { key: 'fitnessEnabled', label: 'Physical Wellness', desc: 'Workout splits and physical body metrics.', icon: 'Activity' },
                        { key: 'nutritionEnabled', label: 'Nutrition & Fuel', desc: 'Monitor daily intake and meal planning.', icon: 'Salad', comingSoon: true },
                    ].map((mod) => (
                        <div key={mod.key} className="flex justify-between items-center py-3 px-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-sm">{mod.label}</p>
                                    {mod.comingSoon && <span className="text-[8px] font-black bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded uppercase">Experimental</span>}
                                </div>
                                <p className="text-[11px] text-pc-muted">{mod.desc}</p>
                            </div>
                            <button
                                disabled={updating || mod.comingSoon}
                                onClick={() => toggleModule(mod.key)}
                                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user[mod.key] ? 'bg-indigo-500' : 'bg-white/10'}`}
                            >
                                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${user[mod.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
