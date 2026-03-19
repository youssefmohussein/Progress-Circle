import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, ShieldAlert, Zap, Users, Info, Flame } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/client';
import { useTheme } from '../context/ThemeContext';

export function NotificationCenter() {
    const { dark } = useTheme();
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
            toast.error('Sync failed.');
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
            toast.success('All notifications marked as read.');
        } catch (error) {
            toast.error('Batch sync failed.');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            toast.error('Deletion failed.');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'task_deadline': return <ShieldAlert className="text-rose-500" size={16} />;
            case 'streak_warning': return <Flame className="text-amber-500" size={16} />;
            case 'battle_invite': return <Zap className="text-indigo-400" size={16} />;
            case 'follow_request': return <Users className="text-emerald-400" size={16} />;
            default: return <Info className="text-muted" size={16} />;
        }
    };

    const unreadCount = notifications.filter(n => n.status === 'pending').length;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-surface2 transition-all relative"
                style={{ color: dark ? 'rgba(255,255,255,0.7)' : 'var(--text-light)' }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-bg">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 md:w-96 bg-surface pc-card shadow-2xl z-50 overflow-hidden border-indigo-500/20"
                            style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
                        >
                            <div className="p-4 border-b border-border/10 flex items-center justify-between">
                                <h3 className="font-black text-sm tracking-tight">Notification Center</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllRead}
                                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest"
                                    >
                                        Read All
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-[100px] max-h-[400px]">
                                {loading && notifications.length === 0 ? (
                                    <div className="p-8 text-center text-xs text-muted">Checking for notifications...</div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-12 text-center text-muted flex flex-col items-center gap-3">
                                        <Bell size={32} className="opacity-10" />
                                        <p className="text-xs">No active notifications found.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/5">
                                        {notifications.map((n) => (
                                            <div 
                                                key={n._id}
                                                className={`p-4 flex gap-3 transition-colors hover:bg-surface2/50 ${n.status === 'pending' ? 'bg-indigo-500/5' : ''}`}
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs leading-relaxed ${n.status === 'pending' ? 'font-bold text-text' : 'text-muted'}`}>
                                                        {n.message}
                                                    </p>
                                                    <span className="text-[9px] text-muted mt-1 block">
                                                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {n.status === 'pending' && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}
                                                            className="p-1.5 rounded-lg bg-surface2 text-emerald-400 hover:bg-emerald-500/10 transition-all border border-emerald-500/5"
                                                        >
                                                            <Check size={12} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                                                        className="p-1.5 rounded-lg bg-surface2 text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-border/5"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
