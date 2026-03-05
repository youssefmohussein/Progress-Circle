import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, CheckSquare, Target, Trash2, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';
import { StatCard } from '../../components/StatCard';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { toast } from 'sonner';

export function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes] = await Promise.all([adminAPI.getStats(), adminAPI.getUsers()]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
        } catch { toast.error('Failed to load admin data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleResetPoints = async (id) => {
        try {
            await adminAPI.resetPoints(id);
            toast.success('Points reset');
            fetchData();
        } catch { toast.error('Failed to reset points'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this user? This cannot be undone.')) return;
        try {
            await adminAPI.deleteUser(id);
            toast.success('User deleted');
            fetchData();
        } catch { toast.error('Failed to delete user'); }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Admin Panel</h1>
                <p className="text-sm text-muted mt-1">System overview and user management</p>
            </div>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="indigo" delay={0} />
                    <StatCard label="Total Tasks" value={stats.totalTasks} icon={CheckSquare} color="sky" delay={0.05} />
                    <StatCard label="Total Habits" value={stats.totalHabits} icon={Trophy} color="orange" delay={0.1} />
                    <StatCard label="Total Goals" value={stats.totalGoals} icon={Target} color="green" delay={0.15} />
                </div>
            )}

            <div className="pc-card">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>User Management</h2>
                    <Button variant="ghost" size="sm" onClick={fetchData}><RefreshCw size={14} />Refresh</Button>
                </div>
                <div className="space-y-2">
                    {users.map((u, i) => (
                        <motion.div
                            key={u._id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-4 p-3 rounded-xl"
                            style={{ background: 'var(--color-surface-2)' }}
                        >
                            <Avatar src={u.avatar} name={u.name} size="sm" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{u.name}</p>
                                <p className="text-xs text-muted truncate">{u.email}</p>
                            </div>
                            <div className="text-right mr-4">
                                <p className="text-sm font-bold text-indigo-500">{u.points} pts</p>
                                <p className="text-xs text-muted">{u.streak}d streak</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleResetPoints(u._id)} className="p-1.5 rounded-lg text-muted hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors" title="Reset points">
                                    <RefreshCw size={14} />
                                </button>
                                <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete user">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
