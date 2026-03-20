import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, Check, Trash2, ShieldAlert, Zap, Users, Info, Flame,
    X, Wallet, Salad, Repeat, Target, Sparkles, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useTheme } from '../context/ThemeContext';

const TYPE_CONFIG = {
    task_deadline:           { icon: ShieldAlert, color: 'var(--primary)', label: 'NEURAL WARNING', path: '/tasks' },
    task_overdue:            { icon: AlertCircle, color: '#ef4444', label: 'MISSION OVERDUE', path: '/tasks' },
    streak_warning:          { icon: Flame,       color: '#fb923c', label: 'CONSISTENCY SYNC', path: '/habits' },
    habit_missed:            { icon: Repeat,      color: '#f472b6', label: 'HABIT DEFICIT', path: '/habits' },
    nutrition_sync:          { icon: Salad,       color: '#4ade80', label: 'FUEL UPDATE', path: '/nutrition' },
    nutrition_deficit:       { icon: Target,      color: '#fbbf24', label: 'METABOLIC ALERT', path: '/nutrition' },
    water_goal_missed:       { icon: Zap,          color: 'var(--accent)', label: 'HYDRATION SYNC', path: '/nutrition' },
    budget_exceeded:         { icon: Wallet,      color: '#fcd34d', label: 'CAPITAL DANGER', path: '/savings' },
    financial_goal_alert:    { icon: Sparkles,    color: 'var(--accent)', label: 'GOAL UPDATE', path: '/savings' },
    battle_invite:           { icon: Zap,          color: 'var(--primary)', label: 'BATTLE INVITE', path: '/squad' },
    neural_milestone_unlocked: { icon: Sparkles,   color: 'var(--accent)', label: 'MILESTONE', path: '/profile' },
    default:                 { icon: Info,        color: 'var(--muted)', label: 'NEURAL LOG', path: '/' }
};

export function NotificationCenter() {
    const { dark } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data);
        } catch (error) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchNotifications();
    }, [isOpen]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, status: 'read' } : n));
        } catch (error) {
            toast.error('Sync failed');
        }
    };

    const deleteAll = async () => {
        try {
            setLoading(true);
            await api.put('/notifications/read-all');
            setNotifications([]);
            setIsOpen(false);
            toast.success('Neural streams cleared.');
        } catch (error) {
            toast.error('Clear failed.');
        } finally {
            setLoading(false);
        }
    };

    const deleteOne = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleNotificationClick = (n) => {
        const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.default;
        if (n.status === 'pending') markAsRead(n._id);
        setIsOpen(false);
        navigate(config.path);
    };

    const unreadCount = notifications.filter(n => n.status === 'pending').length;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(true)}
                className="p-2.5 rounded-xl transition-all relative group"
                style={{ 
                    color: 'var(--text)',
                    background: 'rgba(var(--primary-rgb), 0.05)',
                    border: '1px solid var(--border)'
                }}
            >
                <Bell size={20} className="relative z-10" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[var(--bg)] shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" 
                            onClick={() => setIsOpen(false)} 
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-sm md:max-w-md shadow-2xl z-[60] border-l border-[var(--border)] flex flex-col pc-glass"
                            style={{ background: 'var(--surface)' }}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black tracking-tighter italic" style={{ fontFamily: 'Manrope, sans-serif' }}>NOTIFICATION CENTER</h2>
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60" style={{ color: 'var(--primary)', fontFamily: 'Manrope, sans-serif' }}>Powering your progress</p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[var(--surface2)] rounded-full transition-colors" style={{ color: 'var(--muted)' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Actions Area */}
                            {notifications.length > 0 && (
                                <div className="px-6 py-3 flex justify-end">
                                    <button 
                                        onClick={deleteAll}
                                        className="text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500"
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                    >
                                        <Trash2 size={10} /> Neural Reset
                                    </button>
                                </div>
                            )}

                            {/* Notifications List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                                {loading && notifications.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                                        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40" style={{ fontFamily: 'Manrope, sans-serif' }}>Scanning streams...</p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                                        <Bell size={48} className="mb-4" style={{ color: 'var(--primary)' }} />
                                        <p className="text-sm font-black italic" style={{ fontFamily: 'Manrope, sans-serif' }}>ALL STREAMS CLEAR</p>
                                        <p className="text-[10px] mt-2 font-medium">Neural integrity at 100%. No alerts pending.</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => {
                                        const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.default;
                                        const Icon = config.icon;
                                        return (
                                            <motion.div 
                                                key={n._id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                                                    n.status === 'pending' 
                                                        ? 'bg-[var(--surface2)] border-[var(--border)] shadow-sm' 
                                                        : 'bg-transparent border-transparent opacity-60 grayscale-[0.5]'
                                                }`}
                                                onClick={() => handleNotificationClick(n)}
                                            >
                                                <div className="flex gap-4">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center border border-[var(--border)] group-hover:scale-110 transition-transform" style={{ background: 'var(--surface)' }}>
                                                        <Icon size={18} style={{ color: config.color }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: config.color, fontFamily: 'Manrope, sans-serif' }}>
                                                                {config.label}
                                                            </span>
                                                            <div className="h-1 w-1 rounded-full opacity-20" style={{ background: 'var(--text)' }} />
                                                            <span className="text-[9px] font-bold uppercase" style={{ color: 'var(--muted)', fontFamily: 'Manrope, sans-serif' }}>
                                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-[13px] font-medium leading-snug line-clamp-2" style={{ color: 'var(--text)' }}>
                                                            {n.message}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-2 self-start opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); deleteOne(n._id); }}
                                                            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-500 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {n.status === 'pending' && (
                                                    <div className="absolute right-4 bottom-4 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }} />
                                                )}
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}


