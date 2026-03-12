import { motion } from 'framer-motion';
import { FocusClock } from '../components/FocusClock';
import { MusicDeck } from '../components/MusicDeck';
import { useData } from '../context/DataContext';
import { ArrowLeft, CheckCircle2, Target, Zap, Clock, History, Check, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export function FocusMode() {
    const { tasks, sessions, updateTask } = useData();
    const todayTasks = tasks.filter(t => t.status !== 'completed' && (!t.deadline || dayjs(t.deadline).isSame(dayjs(), 'day')));
    const recentSessions = (sessions || []).slice(0, 5);

    return (
        <div className="fixed inset-0 bg-[#050510] z-[100] overflow-y-auto px-6 pt-12 pb-12 sm:py-12 scrollbar-hide">
            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sm:mb-8">
                    <Link to="/" className="relative z-[110] flex items-center gap-2 text-pc-muted hover:text-white transition-colors text-[10px] sm:text-xs font-black uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Reality
                    </Link>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#818cf8] animate-pulse">Deep Work Mode</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-8 sm:pt-8">
                    {/* Left: Clock (Fixed Position Concept) */}
                    <div className="lg:col-span-4 flex flex-col items-center py-8 lg:py-0 lg:sticky lg:top-12">
                        <div className="scale-[1.2] lg:scale-100 xl:scale-110 origin-center transition-transform duration-500">
                            <FocusClock />
                        </div>
                    </div>

                    {/* Middle: Tasks */}
                    <div className="lg:col-span-4 space-y-8">
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
                                        <button 
                                            onClick={() => updateTask(task.id, { status: 'completed' })}
                                            className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all border border-indigo-500/20"
                                            title="Mark as Complete"
                                        >
                                            <Check size={18} />
                                        </button>
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

                    {/* Right: Music & Logs */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={20} className="text-rose-500" />
                                <h2 className="text-2xl font-black italic tracking-tighter">DEEP RADIOS</h2>
                            </div>
                            <p className="text-pc-muted text-sm">Synchronize your brainwaves.</p>
                        </div>

                        <MusicDeck />

                        {/* History Section moved here for better balance */}
                        <div className="pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-4">
                                <History size={20} className="text-[#818cf8]" />
                                <h2 className="text-xl font-black italic tracking-tighter">MISSION LOGS</h2>
                            </div>
                            <div className="space-y-3">
                                {recentSessions.length === 0 ? (
                                    <p className="text-xs text-pc-muted italic">No logs found in the master archive.</p>
                                ) : (
                                    recentSessions.map((session, idx) => (
                                        <motion.div
                                            key={session.id || session._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.02]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#818cf8]/50" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold uppercase tracking-wide truncate">{session.classification || 'Deep Work'}</p>
                                                    <p className="text-[10px] text-pc-muted">{dayjs(session.startTime).format('MMM D, h:mm A')}</p>
                                                    {session.notes && <p className="text-[10px] text-pc-muted/70 italic mt-0.5 border-l border-white/10 pl-2 line-clamp-1">"{session.notes}"</p>}
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs font-black text-white">{session.duration}m</p>
                                                <p className="text-[9px] uppercase tracking-widest text-[#818cf8] font-bold">Duration</p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ambient Background Glows */}
                <div className="fixed -bottom-64 -left-64 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[200px] pointer-events-none" />
                <div className="fixed -top-64 -right-64 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
            </div>
        </div>
    );
}
