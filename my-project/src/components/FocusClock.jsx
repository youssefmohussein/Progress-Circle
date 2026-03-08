import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';

const SectorSelect = ({ sectors, value, onChange }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newVal, setNewVal] = useState('');
    if (isAdding) return (
        <input autoFocus className="pc-input text-xs h-9 w-full" placeholder="New sector name..." value={newVal}
            onChange={e => setNewVal(e.target.value)}
            onBlur={() => { if (newVal) onChange(newVal); setIsAdding(false); setNewVal(''); }}
            onKeyDown={e => { if (e.key === 'Enter') { if (newVal) onChange(newVal); setIsAdding(false); setNewVal(''); } }} />
    );
    return (
        <select className="pc-input text-xs h-10 w-full cursor-pointer hover:border-indigo-500/50 transition-colors" value={value} onChange={e => {
            if (e.target.value === 'ADD_NEW') setIsAdding(true);
            else onChange(e.target.value);
        }}>
            {sectors.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            <option value="ADD_NEW">+ Add New Sector</option>
        </select>
    );
};

export const FocusClock = () => {
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
        <Card className="relative overflow-hidden p-0 w-full max-w-md mx-auto">
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
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <label className="text-[10px] text-pc-muted font-black uppercase tracking-widest mb-1.5 block">Type</label>
                                    <select className="pc-input text-xs h-10 w-full cursor-pointer hover:border-indigo-500/50 transition-colors" value={type} onChange={e => setType(e.target.value)}>
                                        <option value="focus">🎯 Focus</option>
                                        <option value="break">☕ Break</option>
                                        <option value="sleep">🌙 Sleep</option>
                                    </select>
                                </div>
                                <div className="flex-1">
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
