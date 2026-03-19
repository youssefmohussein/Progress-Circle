import { motion } from 'framer-motion';
import { FocusClock } from '../components/FocusClock';
import { MusicDeck } from '../components/MusicDeck';
import { useData } from '../context/DataContext';
import { ArrowLeft, CheckCircle2, Target, Zap, Clock, History, Check, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { PageInsight } from '../components/PageInsight';

export function FocusMode() {
    const { tasks, sessions, updateTask } = useData();
    const todayTasks = tasks.filter(t => t.status !== 'completed' && (!t.deadline || dayjs(t.deadline).isSame(dayjs(), 'day')));
    const recentSessions = (sessions || []).slice(0, 5);

    const focusBriefing = {
        title: "Neural Focus Protocol",
        intro: "A high-fidelity environment designed for deep cognitive engagement. Utilize the Command Center to synchronize your operative goals with surgical time management.",
        operations: [
            { 
                title: "Protocol Selection", 
                content: "Choose between Pomodoro, 52/17, 90-Minute, or Deep Work sequences based on your current cognitive load and objective complexity." 
            },
            { 
                title: "Mission Assignment", 
                content: "Attach a specific mission (Task) from your Central Intelligence hub to ensure every focus cycle contributes to a high-level objective." 
            },
            { 
                title: "Operative Notes", 
                content: "Document real-time insights and technical blockers within the Focus Clock to maintain analytical clarity across multiple sessions." 
            },
            { 
                title: "Sequence Archiving", 
                content: "Upon completion, your session data is automatically synchronized with the Mission Logs Archive for long-term behavioral auditing." 
            }
        ],
        neuralTip: "Intermittent 'Infinite Flow' sessions are recommended for creative ideation phases where temporal constraints hinder cognitive expansion."
    };

    return (
        <div className="fixed inset-0 bg-[#050510] z-[100] overflow-y-auto px-6 pt-12 pb-12 sm:py-16 scrollbar-hide">
            <div className="max-w-[1600px] mx-auto space-y-8 sm:space-y-16 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-2">
                    <Link to="/" className="relative z-[110] flex items-center gap-3 text-pc-muted hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                        <span className="hidden sm:inline">Back to Reality</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <PageInsight {...focusBriefing} />
                        <div className="h-px w-12 bg-indigo-500/20 hidden md:block" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#818cf8] animate-pulse">Neural Focus Protocol v2.1</p>
                    </div>
                </div>

                <div className="flex flex-col items-center pt-4 sm:pt-8 w-full">
                    <FocusClock />
                </div>

                <div className="space-y-12 pt-20 border-t border-white/5 w-full max-w-7xl mx-auto">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <History size={20} className="text-[#818cf8]" />
                                <h2 className="text-xl font-black italic tracking-tighter uppercase font-manrope">Mission Logs Archive</h2>
                            </div>
                            <p className="text-[10px] text-pc-muted font-black uppercase tracking-widest">{recentSessions.length} Recent Sequences Detected</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentSessions.length === 0 ? (
                                <div className="col-span-full py-12 text-center pc-card bg-white/[0.01]">
                                    <p className="text-xs text-pc-muted italic">No logs found in the neural archive.</p>
                                </div>
                            ) : (
                                recentSessions.map((session, idx) => (
                                    <motion.div
                                        key={session.id || session._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="pc-card group hover:border-[#818cf8]/30 transition-all p-5"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#818cf8]" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#818cf8]">{session.technique || 'Deep Work'}</span>
                                            </div>
                                            <span className="text-[10px] text-pc-muted font-bold tracking-tight">{dayjs(session.startTime).format('MMM D, HH:mm')}</span>
                                        </div>
                                        
                                        {session.notes ? (
                                            <p className="text-xs text-white/80 leading-relaxed font-medium mb-4 line-clamp-3">
                                                {session.notes}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-pc-muted/50 italic mb-4">No operative notes recorded.</p>
                                        )}
                                        
                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                            <div className="text-[10px] text-pc-muted font-bold uppercase tracking-widest">Efficiency</div>
                                            <div className="text-sm font-black text-white">{session.duration}m</div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
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
