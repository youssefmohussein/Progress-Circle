import { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Coffee, Target, ChevronRight, History, MoreVertical, Play, Square, RefreshCcw } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const TECHNIQUES = [
    { id: 'pomodoro', name: 'Pomodoro', work: 25, break: 5, icon: Zap, color: 'text-rose-500' },
    { id: '52-17', name: '52/17 Rule', work: 52, break: 17, icon: Target, color: 'text-indigo-500' },
    { id: '90-min', name: '90 Minute', work: 90, break: 15, icon: Coffee, color: 'text-amber-500' },
    { id: 'deep', name: 'Deep Work', work: 62, break: 0, icon: Target, color: 'text-emerald-500' },
    { id: 'flow', name: 'Infinite Flow', work: 0, break: 0, icon: RefreshCcw, color: 'text-blue-500' },
];


const NeuralSelect = ({ label, value, options, onChange, placeholder = "Select option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="space-y-2 relative">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 pl-1">{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-[11px] font-bold text-white flex items-center justify-between hover:bg-white/5 transition-all outline-none focus:border-indigo-500/40"
            >
                <span className={selectedOption ? "text-white" : "text-white/40"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronRight size={14} className={`text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-[#12141c] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl"
                        >
                            <div className="max-h-48 overflow-y-auto scrollbar-hide py-1">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-[11px] font-bold transition-colors border-b border-white/[0.02] last:border-0 ${
                                            value === opt.value ? 'bg-indigo-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FocusClock = () => {
    const { activeSession, tasks, sessions, startSession, endSession } = useData();
    const [selectedTechnique, setSelectedTechnique] = useState(TECHNIQUES[0]);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [totalCycles, setTotalCycles] = useState(1);
    const [currentCycle, setCurrentCycle] = useState(1);
    const [isBreak, setIsBreak] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TECHNIQUES[0].work * 60);
    const [notes, setNotes] = useState('');
    const timerRef = useRef(null);

    const todayTasks = tasks.filter(t => t.status !== 'completed');
    const taskOptions = [
        { value: '', label: 'No specific mission' },
        ...todayTasks.map(t => ({ value: t.id || t._id, label: t.title }))
    ];

    useEffect(() => {
        if (activeSession) {
            setNotes(activeSession.notes || '');
            const tech = TECHNIQUES.find(t => t.name === activeSession.technique) || TECHNIQUES[0];
            setSelectedTechnique(tech);
            setSelectedTaskId(activeSession.taskId || '');
            setTotalCycles(activeSession.totalCycles || 1);
            setCurrentCycle(activeSession.completedCycles + 1 || 1);
            
            // Sync time display
            const elapsed = Math.round((Date.now() - new Date(activeSession.startTime)) / 1000);
            if (tech.id === 'flow') {
                setTimeLeft(elapsed);
            } else {
                const totalTarget = tech.work * 60;
                setTimeLeft(Math.max(0, totalTarget - elapsed));
            }

            if (!timerRef.current) {
                timerRef.current = setInterval(() => {
                    setTimeLeft(prev => {
                        if (tech.id === 'flow') return prev + 1;
                        if (prev <= 0) return 0;
                        return prev - 1;
                    });
                }, 1000);
            }
        } else {
            clearInterval(timerRef.current);
            timerRef.current = null;
            if (selectedTechnique.id !== 'flow') {
                setTimeLeft(selectedTechnique.work * 60);
            } else {
                setTimeLeft(0);
            }
        }
        return () => clearInterval(timerRef.current);
    }, [activeSession, selectedTechnique]);

    const fmt = (s) => {
        const m = Math.floor(s / 60), sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const handleStart = async () => {
        await startSession({
            technique: selectedTechnique.name,
            taskId: selectedTaskId || null,
            totalCycles: totalCycles,
            notes: notes,
            type: 'focus',
            classification: 'Neural Focus'
        });
        toast.success(`Protocol ${selectedTechnique.name} initialized.`);
    };

    const handleEnd = async () => {
        await endSession(notes, activeSession.id || activeSession._id);
        toast.success("Session data archived.");
        setNotes('');
    };

    return (
        <Card className="relative overflow-hidden p-0 w-full bg-[#0b0c14]/80 border-white/5 shadow-2xl transition-all duration-700">
            <div className={`absolute top-0 left-0 w-1 lg:w-2 lg:h-full h-full ${activeSession ? 'bg-indigo-500' : 'bg-white/5'}`} />

            <div className="p-8 lg:p-16">
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-20">
                    {/* Left Side: Timer (The Focal Point) */}
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                        {/* Status Indicator (Mobile/Tablet) */}
                        <div className="lg:hidden w-full flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Timer size={18} className="text-white/40" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Protocol</h3>
                            </div>
                            {activeSession && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                </div>
                            )}
                        </div>

                        {/* Main Timer Display */}
                        <div className="relative flex flex-col items-center group">
                            <div className="relative">
                                <svg className="w-64 h-64 lg:w-[420px] lg:h-[420px] -rotate-90 transition-all duration-1000">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        className="stroke-white/[0.02] fill-none"
                                        strokeWidth="2"
                                    />
                                    {selectedTechnique.id !== 'flow' && (
                                        <motion.circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            className="stroke-indigo-500/80 fill-none"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 1 }}
                                            animate={{ pathLength: timeLeft / (selectedTechnique.work * 60) }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    )}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span 
                                        key={timeLeft}
                                        initial={{ filter: 'blur(4px)', opacity: 0.8 }}
                                        animate={{ filter: 'blur(0px)', opacity: 1 }}
                                        className="text-6xl lg:text-9xl font-black italic tracking-tighter font-manrope pc-gradient-text"
                                    >
                                        {fmt(timeLeft)}
                                    </motion.span>
                                    <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.5em] text-white/20 mt-4">
                                        {selectedTechnique.id === 'flow' ? 'Continuous Stream' : 'Focus Integrity'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Ambient Glow behind Timer */}
                            <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        </div>
                    </div>

                    {/* Right Side: Control & Configuration */}
                    <div className="flex-1 space-y-10 lg:space-y-12 mt-12 lg:mt-0">
                        {/* Header: Technique Selection */}
                        <div className="space-y-6">
                            <div className="hidden lg:flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                                        <Target size={20} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Select Protocol</h3>
                                        <p className="text-[9px] font-bold text-white/30 uppercase mt-1">Configure your neural focus parameters</p>
                                    </div>
                                </div>
                                {activeSession && (
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Active</span>
                                    </div>
                                )}
                            </div>

                            {!activeSession ? (
                                <div className="grid grid-cols-5 gap-3">
                                    {TECHNIQUES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setSelectedTechnique(t)}
                                            className={`relative flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-300 group ${
                                                selectedTechnique.id === t.id 
                                                ? 'bg-white/10 border-indigo-500/50 text-white shadow-xl shadow-indigo-500/10' 
                                                : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5'
                                            }`}
                                        >
                                            <t.icon size={22} className={selectedTechnique.id === t.id ? t.color : 'text-white/20 group-hover:text-white/40'} />
                                            <span className="text-[9px] font-black uppercase tracking-tighter text-center">{t.name}</span>
                                            {selectedTechnique.id === t.id && (
                                                <motion.div layoutId="activeTech" className="absolute -bottom-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="pc-card p-6 flex items-center gap-6 bg-indigo-500/5 border-indigo-500/10 rounded-[2rem]">
                                    <div className="p-4 bg-indigo-500/10 rounded-2xl">
                                        <selectedTechnique.icon size={32} className={`${selectedTechnique.color} animate-pulse`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-[0.2em] text-white">{selectedTechnique.name} Sequence</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[11px] text-white/40 font-bold uppercase">Cycle {currentCycle} of {totalCycles}</span>
                                            <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-indigo-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(currentCycle / totalCycles) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Configuration: Task & Notes */}
                        <div className="space-y-6">
                            {!activeSession && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex-grow">
                                        <NeuralSelect 
                                            label="Assign Mission"
                                            value={selectedTaskId}
                                            options={taskOptions}
                                            onChange={setSelectedTaskId}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 pl-1">Repeat Cycles</label>
                                        <div className="relative flex items-center">
                                            <input 
                                                type="number" 
                                                min="1" max="10" 
                                                className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-[11px] font-bold text-white outline-none focus:border-indigo-500/40 transition-all pr-12"
                                                value={totalCycles}
                                                onChange={(e) => setTotalCycles(Number(e.target.value))}
                                            />
                                            <div className="absolute right-4 text-[9px] font-black text-white/20 uppercase tracking-widest pointer-events-none">Qty</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 pl-1">Operative Notes</label>
                                <textarea 
                                    className="w-full bg-white/[0.03] border border-white/5 p-5 rounded-[2rem] text-sm font-medium text-white/80 outline-none focus:border-indigo-500/40 transition-all resize-none min-h-[120px] lg:min-h-[160px] scrollbar-hide"
                                    placeholder="Document your focus sequence insights..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 lg:pt-0">
                            {!activeSession ? (
                                <button
                                    onClick={handleStart}
                                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-4 active:scale-[0.98] group"
                                >
                                    <Play size={18} fill="white" className="group-hover:translate-x-0.5 transition-transform" /> 
                                    Initialize Neural Sequence
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnd}
                                    className="w-full py-6 bg-rose-500 hover:bg-rose-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] transition-all shadow-2xl shadow-rose-900/20 flex items-center justify-center gap-4 active:scale-[0.98] group"
                                >
                                    <Square size={18} fill="white" className="group-hover:scale-110 transition-transform" /> 
                                    Terminate Focus Session
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        </Card>
    );
};
