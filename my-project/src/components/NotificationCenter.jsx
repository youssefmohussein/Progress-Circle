import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Swords, Zap, UserPlus } from 'lucide-react';
import api from '../api/client';
import { Button } from './Button';
import { toast } from 'sonner';

export function NotificationCenter({ open, onClose }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) fetchNotifications();
    }, [open]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/social/notifications');
            if (res.data.success) setNotifications(res.data.data);
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'accept' || action === 'reject') {
                const res = await api.post(`/social/battle/respond/${id}`, { action });
                toast.success(`Battle ${action}ed!`);
                if (action === 'accept' && res.data.success) {
                   navigate(`/battle/${res.data.data._id}`);
                   onClose();
                }
            }
            // Mark notification as read/handled
            setNotifications(prev => prev.filter(n => n.refId !== id));
        } catch (err) {
            toast.error('Action failed');
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#0A0A0B] border-l border-white/5 z-[101] p-6 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black pc-gradient-text tracking-tight flex items-center gap-3">
                                <Bell className="text-indigo-500" size={20} /> Astra Comms
                            </h2>
                            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Zap className="animate-spin text-indigo-500" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted font-bold text-sm">No pending protocols.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notifications.map((n) => (
                                    <div key={n._id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                                {n.type === 'battle_invite' ? <Swords size={16} /> : <Zap size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white leading-tight">{n.message}</p>
                                                <p className="text-[10px] text-muted font-black uppercase mt-1">2m ago</p>
                                            </div>
                                        </div>
                                        
                                        {n.type === 'battle_invite' && (
                                            <div className="flex gap-2">
                                                <Button 
                                                    size="sm" 
                                                    className="flex-1 bg-indigo-500 h-9 text-[10px] uppercase font-black"
                                                    onClick={() => handleAction(n.refId, 'accept')}
                                                >
                                                    Accept
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary" 
                                                    className="flex-1 h-9 text-[10px] uppercase font-black"
                                                    onClick={() => handleAction(n.refId, 'reject')}
                                                >
                                                    Decline
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
