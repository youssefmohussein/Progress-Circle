import { motion } from 'framer-motion';
import { FocusClock } from '../components/FocusClock';
import { useData } from '../context/DataContext';
import { ArrowLeft, CheckCircle2, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export function FocusMode() {
    const { tasks } = useData();
    const todayTasks = tasks.filter(t => t.status !== 'completed' && (!t.deadline || dayjs(t.deadline).isSame(dayjs(), 'day')));

    return (
        <div className="fixed inset-0 bg-[#050510] z-[100] overflow-y-auto px-6 py-12">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-pc-muted hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Reality
                    </Link>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#818cf8] animate-pulse">Deep Work Mode</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Clock */}
                    <div className="flex flex-col items-center">
                        <div className="scale-110 sm:scale-125 origin-center">
                            <FocusClock />
                        </div>
                    </div>

                    {/* Right: Tasks */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={20} className="text-indigo-500" />
                                <h2 className="text-2xl font-black italic tracking-tighter">THE MISSION</h2>
                            </div>
                            <p className="text-pc-muted text-sm">Focus on these nodes. Ignore the noise.</p>
                        </div>

                        <div className="space-y-4">
                            {todayTasks.length === 0 ? (
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 text-center">
                                    <CheckCircle2 size={32} className="mx-auto mb-3 text-green-500" />
                                    <p className="font-bold">Mission Accomplished.</p>
                                    <p className="text-xs text-pc-muted">No pending tasks for today.</p>
                                </div>
                            ) : (
                                todayTasks.slice(0, 5).map((task, idx) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all cursor-default"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <div className="flex-1">
                                            <p className="font-bold text-lg leading-tight uppercase tracking-tight">{task.title}</p>
                                            {task.description && <p className="text-xs text-pc-muted mt-1 line-clamp-1">{task.description}</p>}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {todayTasks.length > 5 && (
                            <p className="text-[10px] font-black uppercase tracking-widest text-pc-muted text-center pt-2">
                                + {todayTasks.length - 5} more in your master plan
                            </p>
                        )}
                    </div>
                </div>

                {/* Ambient Background Glows */}
                <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed -top-32 -right-32 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
            </div>
        </div>
    );
}
