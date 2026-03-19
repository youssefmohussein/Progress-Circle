import { motion, AnimatePresence } from 'framer-motion';
import { FocusClock } from '../components/FocusClock';
import { MusicDeck } from '../components/MusicDeck';
import { useData } from '../context/DataContext';
import { ArrowLeft, CheckCircle2, Target, Zap, Clock, History, Check, Music, Monitor, Layout, Sliders, PlayCircle, CloudRain, Rocket, User, Coffee, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';

import { PageInsight } from '../components/PageInsight';
import { FocusVideo } from '../components/FocusVideo';
import { Modal } from '../components/Modal';
import { useState } from 'react';

export function FocusMode() {
    const { tasks, sessions, activeSession } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const isPremium = user?.plan === 'premium';
    const todayTasks = tasks.filter(t => t.status !== 'completed' && (!t.deadline || dayjs(t.deadline).isSame(dayjs(), 'day')));
    const recentSessions = (sessions || []).slice(0, 5);

    const [activeVisual, setActiveVisual] = useState(null);
    const [isLogsOpen, setIsLogsOpen] = useState(false);

    const VISUAL_PRESETS = [
        { id: 'lofi', name: 'Lofi Girl', videoId: 'jfKfPfyJRdk', icon: Music, isPremium: true },
        { id: 'rain', name: 'Rainy Night', videoId: 'q76bMs-NwRk', icon: CloudRain, isPremium: true },
        { id: 'cyber', name: 'Cyber City', videoId: 'S_dfq9rFWAE', icon: Rocket, isPremium: true },
        { id: 'cabin', name: 'Cozy Cabin', videoId: 'L_LUpnjgPso', icon: Coffee, isPremium: true },
    ];

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
        <div className={`fixed inset-0 z-[100] overflow-y-auto scrollbar-hide transition-colors duration-1000 ${activeVisual ? 'bg-transparent' : 'bg-[#050510]'}`}>
            {/* Neural Immersion Engine */}
            <FocusVideo videoId={activeVisual?.videoId} active={!!activeVisual} opacity={0.6} activeSession={activeSession} />

            <div className={`max-w-[1600px] mx-auto px-6 pt-12 pb-12 sm:py-16 space-y-8 sm:space-y-16 relative z-10 transition-all duration-700 ${activeSession ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-2">
                    <Link to="/" className="relative z-[110] flex items-center gap-3 text-pc-muted hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                        <span className="hidden sm:inline">Back to Reality</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsLogsOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all"
                        >
                            <History size={14} className="text-[#818cf8]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#818cf8]">Mission Logs</span>
                        </button>
                        <PageInsight {...focusBriefing} />
                        <div className="h-px w-12 bg-indigo-500/20 hidden md:block" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#818cf8] animate-pulse">Neural Focus Protocol v2.2</p>
                    </div>
                </div>

                <div className="flex flex-col items-center pt-4 sm:pt-8 w-full gap-8">
                    {/* Visual Preset Selector (Floating Mini Bar) */}
                    <div className={`flex items-center gap-2 p-1.5 rounded-2xl shadow-2xl transition-all duration-500 ${activeVisual ? 'bg-black/20 backdrop-blur-3xl border border-white/5' : 'bg-white/[0.02] border border-white/5'}`}>
                        <button 
                            onClick={() => setActiveVisual(null)}
                            className={`p-2.5 rounded-xl transition-all ${!activeVisual ? 'bg-white/10 text-white shadow-inner shadow-white/10' : 'text-white/20 hover:text-white/40'}`}
                            title="Original Zen"
                        >
                            <Zap size={16} />
                        </button>
                        <div className="w-px h-6 bg-white/5 mx-1" />
                        {VISUAL_PRESETS.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => {
                                    if (preset.isPremium && !isPremium) {
                                        navigate('/pricing');
                                        return;
                                    }
                                    setActiveVisual(activeVisual?.id === preset.id ? null : preset);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeVisual?.id === preset.id ? 'bg-indigo-500/80 backdrop-blur-md text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                            >
                                <preset.icon size={12} />
                                <span>{preset.name}</span>
                                {preset.isPremium && !isPremium && <Lock size={10} className="ml-1 text-amber-500" />}
                            </button>
                        ))}
                    </div>

                    <FocusClock immersive={!!activeVisual} />
                </div>
            </div>

            {/* Draggable HUD Container (Only visible when activeSession is true) */}
            <AnimatePresence>
                {activeSession && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 pointer-events-none"
                    >
                        {/* We will render the Draggable Timer inside FocusClock, but it needs an activeSession awareness wrapper. Actually, FocusClock handles it internally. */}
                        <div className="w-full h-full pointer-events-auto flex items-center justify-center">
                            <FocusClock immersive={!!activeVisual} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Modal open={isLogsOpen} onClose={() => setIsLogsOpen(false)} title="Mission Logs Archive" maxWidth="800px">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
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
            </Modal>


            {/* Ambient Background Glows (Only shown when not immersive) */}
            {!activeVisual && (
                <>
                    <div className="fixed -bottom-64 -left-64 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[200px] pointer-events-none" />
                    <div className="fixed -top-64 -right-64 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
                </>
            )}
        </div>
    );
}

