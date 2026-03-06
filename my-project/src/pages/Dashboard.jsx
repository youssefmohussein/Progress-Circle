import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Trophy, Target, TrendingUp, Clock, CalendarDays, Brain, BellRing, Sparkles, Timer, PieChart, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { PriorityBadge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const QUOTES = [
    'Great work today!',
    'Consistency builds greatness.',
    'One more step forward.',
    'Small habits, extraordinary results.',
    'You\'re making progress every day.',
];

const SectorSelect = ({ sectors, value, onChange }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newVal, setNewVal] = useState('');
    if (isAdding) return (
        <input autoFocus className="pc-input text-xs h-9 w-full" placeholder="New sector name..." value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && newVal) { onChange(newVal); setIsAdding(false); setNewVal(''); } }}
            onBlur={() => { if (!newVal) setIsAdding(false); }} />
    );
    return (
        <select className="pc-input text-xs h-9 w-full" value={value} onChange={(e) => e.target.value === '__add__' ? setIsAdding(true) : onChange(e.target.value)}>
            {sectors.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            <option value="__add__">+ Add Sector</option>
        </select>
    );
};

const FocusClock = () => {
    const { activeSession, sessions, startSession, endSession, logManual } = useData();
    const [tab, setTab] = useState('live'); // 'live' | 'manual'
    const [elapsed, setElapsed] = useState(0);
    const [notes, setNotes] = useState('');
    const [type, setType] = useState('focus');
    const [classification, setClassification] = useState('uni');
    // Manual entry state
    const [manualDate, setManualDate] = useState(new Date().toISOString().slice(0, 10));
    const [manualHours, setManualHours] = useState('');
    const [manualMinutes, setManualMinutes] = useState('');
    const [manualNotes, setManualNotes] = useState('');
    const [manualType, setManualType] = useState('focus');
    const [manualSector, setManualSector] = useState('uni');

    const sectors = Array.from(new Set(['uni', 'bus', 'break', 'sleep', ...sessions.map(s => s.classification).filter(Boolean)]));

    useEffect(() => {
        if (!activeSession) { setElapsed(0); return; }
        setNotes(activeSession.notes || '');
        setType(activeSession.type || 'focus');
        setClassification(activeSession.classification || 'uni');
        const iv = setInterval(() => {
            setElapsed(Math.round((Date.now() - new Date(activeSession.startTime)) / 1000));
        }, 1000);
        return () => clearInterval(iv);
    }, [activeSession]);

    const fmt = (s) => {
        const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const handleStart = async () => {
        if (!classification) return toast.error('Choose a sector');
        await startSession({ type, classification, notes });
    };

    const handleLogManual = async () => {
        const h = parseInt(manualHours) || 0;
        const m = parseInt(manualMinutes) || 0;
        const duration = h * 60 + m;
        if (duration <= 0) return toast.error('Enter a valid duration');
        const startTime = new Date(manualDate);
        startTime.setHours(startTime.getHours() - h);
        const endTime = new Date(manualDate);
        await logManual({ type: manualType, classification: manualSector, startTime, endTime, duration, notes: manualNotes, isActive: false });
        toast.success(`Logged ${h}h ${m}m of ${manualType}`);
        setManualHours(''); setManualMinutes(''); setManualNotes('');
    };

    return (
        <Card className="relative overflow-hidden p-0">
            <div className={`absolute top-0 left-0 w-1 h-full ${activeSession ? 'bg-green-500' : 'bg-indigo-500/30'}`} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${activeSession ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        <Timer size={16} />
                    </div>
                    <span className="font-black text-sm tracking-tight">Focus Clock</span>
                </div>
                {activeSession && (
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-green-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                        Live
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex mx-5 mb-4 rounded-xl bg-white/5 p-0.5 gap-0.5">
                {[['live', 'Live Timer'], ['manual', 'Log Past']].map(([key, label]) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`flex-1 text-[11px] font-black uppercase tracking-widest py-2 rounded-lg transition-all ${tab === key ? 'bg-indigo-600 text-white shadow' : 'text-pc-muted hover:text-white'}`}>
                        {label}
                    </button>
                ))}
            </div>

            <div className="px-5 pb-5 space-y-3">
                {tab === 'live' ? (
                    <>
                        {/* Timer display */}
                        <div className="text-center py-3">
                            <div className="text-5xl font-black tracking-tight pc-gradient-text" style={{ fontFamily: 'Monaco, monospace' }}>
                                {fmt(elapsed)}
                            </div>
                            {!activeSession && <p className="text-[11px] text-pc-muted mt-1">Press Start to begin tracking</p>}
                            {activeSession && <p className="text-[11px] text-pc-muted mt-1">{activeSession.classification} · {activeSession.type}</p>}
                        </div>

                        {!activeSession && (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-pc-muted font-black uppercase tracking-widest mb-1 block">Type</label>
                                    <select className="pc-input text-xs h-9 w-full" value={type} onChange={e => setType(e.target.value)}>
                                        <option value="focus">🎯 Focus</option>
                                        <option value="break">☕ Break</option>
                                        <option value="sleep">🌙 Sleep</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-pc-muted font-black uppercase tracking-widest mb-1 block">Sector</label>
                                    <SectorSelect sectors={sectors} value={classification} onChange={setClassification} />
                                </div>
                            </div>
                        )}

                        <textarea className="pc-input text-xs w-full resize-none py-2 px-3 min-h-[60px]"
                            placeholder="Notes (optional)..." value={notes} onChange={e => setNotes(e.target.value)} />

                        {activeSession ? (
                            <Button variant="primary" className="w-full bg-rose-500 hover:bg-rose-600 border-none" onClick={() => endSession(notes, activeSession.id || activeSession._id)}>
                                ⏹ End Session
                            </Button>
                        ) : (
                            <Button variant="primary" className="w-full" onClick={handleStart}>
                                ▶ Start Focus
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        <p className="text-[11px] text-pc-muted">Forgot to start? Log a past session manually.</p>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-pc-muted font-black uppercase tracking-widest mb-1 block">Type</label>
                                <select className="pc-input text-xs h-9 w-full" value={manualType} onChange={e => setManualType(e.target.value)}>
                                    <option value="focus">🎯 Focus</option>
                                    <option value="break">☕ Break</option>
                                    <option value="sleep">🌙 Sleep</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-pc-muted font-black uppercase tracking-widest mb-1 block">Sector</label>
                                <SectorSelect sectors={sectors} value={manualSector} onChange={setManualSector} />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-pc-muted font-black uppercase tracking-widest mb-1 block">Date</label>
                            <input type="date" className="pc-input text-xs h-9 w-full" value={manualDate} onChange={e => setManualDate(e.target.value)} />
                        </div>

                        <div>
                            <label className="text-[10px] text-pc-muted font-black uppercase tracking-widest mb-1 block">Duration</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="number" min="0" max="23" className="pc-input text-xs h-9" placeholder="Hours (e.g. 2)" value={manualHours} onChange={e => setManualHours(e.target.value)} />
                                <input type="number" min="0" max="59" className="pc-input text-xs h-9" placeholder="Minutes (e.g. 30)" value={manualMinutes} onChange={e => setManualMinutes(e.target.value)} />
                            </div>
                        </div>

                        <textarea className="pc-input text-xs w-full resize-none py-2 px-3 min-h-[60px]"
                            placeholder="What did you work on?" value={manualNotes} onChange={e => setManualNotes(e.target.value)} />

                        <Button variant="primary" className="w-full" onClick={handleLogManual}>
                            Save Session
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
};

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function getCountdown(deadline) {
    const now = dayjs();
    const then = dayjs(deadline);
    const diff = then.diff(now);
    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    let timeStr = "";
    if (days > 0) timeStr = `${days} days ${hours} hours`;
    else if (hours > 0) timeStr = `${hours} hours ${minutes} minutes`;
    else timeStr = `${minutes} minutes`;

    if (diff <= 0) return `Overdue by ${timeStr}`;
    return timeStr;
}

export function Dashboard() {
    const { user } = useAuth();
    const {
        tasks, categories, leaderboard, sessions
    } = useData();

    if (!tasks || !categories || !leaderboard || !sessions) return <LoadingSpinner />;

    // Stats & Insights - Use Sessions for real analytics
    const completedTasks = tasks.filter(t => t.status === 'completed');

    // Focus time: Only 'focus' sessions
    const focusSessions = sessions.filter(s => s.type === 'focus');
    const totalTimeSpent = focusSessions.reduce((acc, s) => acc + (s.duration || 0), 0);

    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    const estimatedTimeRemaining = pendingTasks.reduce((acc, t) => acc + (t.estimatedTime || 0), 0);

    // Focus & Free Time Calculation
    const DAILY_BUDGET = 960; // 16h focus budget
    const todaySessions = sessions.filter(s => dayjs(s.startTime).isSame(dayjs(), 'day'));
    const focusToday = todaySessions.filter(s => s.type === 'focus').reduce((acc, s) => acc + (s.duration || 0), 0);
    const spentToday = focusToday;
    const freeTimeToday = Math.max(0, DAILY_BUDGET - spentToday);

    // Productivity Predictions
    let prediction = { title: "On Track", desc: "Your workload fits within available time.", type: "success" };
    if (estimatedTimeRemaining > freeTimeToday) {
        prediction = { title: "Heavy Workload", desc: "Pending tasks might exceed your available free time today.", type: "warning" };
    } else if (pendingTasks.filter(t => !t.parentId).length > 5) {
        prediction = { title: "Busy Day Ahead", desc: "Focus on your high-priority tasks first to stay productive.", type: "info" };
    }

    // "Top Priority Nodes" - Strictly tasks ending within 48 hours
    const urgentTasks = tasks
        .filter(t => t.status !== 'completed' && t.deadline && dayjs(t.deadline).diff(dayjs(), 'hour') <= 48)
        .sort((a, b) => dayjs(a.deadline).diff(dayjs(b.deadline)));

    const todaysTasks = urgentTasks.slice(0, 6);
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-between items-end">
                <div>
                    <h1 className="font-black pc-gradient-text page-title" style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.6rem, 6vw, 2.25rem)' }}>
                        {getGreeting()}, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-xs text-muted font-medium mt-1 uppercase tracking-widest">{quote}</p>
                </div>
            </motion.div>

            {/* Prediction & Insights Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className={`col-span-1 md:col-span-2 pc-card relative overflow-hidden flex items-center gap-4 p-4 border-l-4 ${prediction.type === 'warning' ? 'border-rose-500 bg-rose-500/5' : 'border-indigo-500 bg-indigo-500/5'}`}>
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${prediction.type === 'warning' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pc-muted mb-0.5">AI Productivity Prediction</h3>
                        <p className="font-bold text-base leading-tight">{prediction.title}</p>
                        <p className="text-xs text-pc-muted mt-0.5">{prediction.desc}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="pc-card bg-indigo-500/10 border-indigo-500/20 flex flex-col justify-center text-center p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Available Focus Time</p>
                    <p className="text-2xl font-black text-indigo-500">{Math.floor(freeTimeToday / 60)}h {freeTimeToday % 60}m</p>
                </motion.div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Tasks Done" value={completedTasks.length} icon={CheckCircle2} color="green" />
                <StatCard label="Time Tracked" value={`${Math.floor(totalTimeSpent / 60)}h`} icon={Clock} color="indigo" />
                <StatCard label="Task Streak" value={user?.streak ?? 0} icon={Flame} color="orange" />
                <StatCard label="Focus Points" value={user?.points ?? 0} icon={Trophy} color="sky" />
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    {/* Focus Clock */}
                    <FocusClock />
                </div>

                <div className="lg:col-span-2">
                    {/* Today's Tasks - Ticket Tree */}
                    <Card>
                        <div className="flex items-center gap-2 mb-6">
                            <CheckCircle2 size={24} className="text-indigo-500" />
                            <h2 className="text-xl font-black">Top Priority Nodes</h2>
                            <span className="ml-auto text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 font-black uppercase">
                                {todaysTasks.length} queued
                            </span>
                        </div>
                        {todaysTasks.length === 0 ? (
                            <EmptyState icon={CheckCircle2} title="System Optimized" description="All tasks for today are completed." />
                        ) : (() => {
                            // Group: separate top-level tasks from sub-tasks
                            const bigTasks = todaysTasks.filter(t => !t.parentId);
                            const subTasks = todaysTasks.filter(t => t.parentId);
                            // Group sub-tasks by their parentId
                            const byParent = {};
                            subTasks.forEach(st => {
                                const pid = st.parentId?._id || st.parentId;
                                if (!byParent[pid]) byParent[pid] = [];
                                byParent[pid].push(st);
                            });
                            // Collect all parent IDs (may not have deadline themselves)
                            const parentIds = [...new Set(subTasks.map(st => st.parentId?._id || st.parentId))];
                            const allParents = tasks.filter(t => parentIds.includes(t.id || t._id));

                            const TaskTicket = ({ task, isSubTask }) => (
                                <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all group ${isSubTask
                                    ? 'bg-white/3 border-white/5 ml-4'
                                    : 'bg-white/5 border-white/8 hover:border-indigo-500/30'
                                    } ${getCountdown(task.deadline).startsWith('Overdue') ? 'border-rose-500/20 bg-rose-500/5' : ''}`}>
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-orange-400' : 'bg-green-500'
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate group-hover:text-indigo-400 transition-colors">{task.title}</p>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 mt-0.5 ${getCountdown(task.deadline).startsWith('Overdue') ? 'text-rose-400' : 'text-pc-muted'
                                            }`}>
                                            <Clock size={9} /> {getCountdown(task.deadline)}
                                        </span>
                                    </div>
                                </div>
                            );

                            return (
                                <div className="space-y-3">
                                    {/* Standalone big tasks with deadline */}
                                    {bigTasks.map(task => (
                                        <div key={task.id} className="space-y-1.5">
                                            <TaskTicket task={task} isSubTask={false} />
                                        </div>
                                    ))}
                                    {/* Sub-tasks grouped under parent */}
                                    {allParents.map(parent => (
                                        <div key={parent.id} className="space-y-1.5">
                                            <div className="flex items-center gap-2 px-2 py-1">
                                                <div className="w-1.5 h-1.5 rounded-sm bg-indigo-500" />
                                                <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest truncate">{parent.title}</span>
                                                <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded font-black ml-auto">{(byParent[parent.id] || []).length} sub-tasks</span>
                                            </div>
                                            <div className="space-y-1">
                                                {(byParent[parent.id] || []).map(st => (
                                                    <TaskTicket key={st.id} task={st} isSubTask />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {/* Sub-tasks whose parent wasn't listed */}
                                    {subTasks.filter(st => !allParents.find(p => (p.id || p._id) === (st.parentId?._id || st.parentId))).map(st => (
                                        <TaskTicket key={st.id} task={st} isSubTask />
                                    ))}
                                </div>
                            );
                        })()}
                    </Card>
                </div>
            </div>
        </div>
    );
}
