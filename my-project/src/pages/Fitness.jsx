/* [APEX ELITE V2.1] - Resolved History naming collision */
import { useState, useEffect, useMemo } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, Dumbbell, TrendingUp, Scale, 
    ChevronRight, Plus, Trash2, Calendar, 
    Zap, Target, Layers, Ruler, Edit2, Clock, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { Confetti } from '../components/Confetti';

// APEX ELITE: Neural Restoration Terminology
const UI = {
    WORKOUTS: 'Workout Splits',
    BODY: 'Body Metrics',
    CYCLES: 'Cycle Archive',
    HISTORY: 'Exertion Timeline',
    PLAN: 'Protocol'
};

export function Fitness() {
    const { user } = useAuth();
    useSEO('Physical Wellness Engine', 'Track workout cycles, log body metrics, and optimize your physical performance with ProgressCircle fitness module.');
    
    const [cycle, setCycle] = useState(null);
    const [cycleHistory, setCycleHistory] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiVariant, setConfettiVariant] = useState('pulse');
    
    // View State
    const [activeTab, setActiveTab] = useState('workouts'); // Internal toggle for mobile or focused view
    const [showSetup, setShowSetup] = useState(false);
    const [setupStep, setSetupStep] = useState(1);
    const [setupData, setSetupData] = useState({ cycleType: 'Hypertrophy Phase 1', daysCount: 4, daysConfig: [] });

    // Logger State
    const [logData, setLogData] = useState({
        date: new Date().toISOString().split('T')[0],
        isRestDay: false,
        workoutCompleted: false,
        routineDone: '',
        weight: '',
        notes: ''
    });

    const [metricData, setMetricData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '', bmr: '', muscleMass: '', bodyFat: '', stomach: '', arm: '', leg: ''
    });

    const fetchData = async () => {
        try {
            const [cycleRes, historyRes, metricRes] = await Promise.all([
                api.get('/fitness/cycle'),
                api.get('/fitness/cycle/history'),
                api.get('/fitness/metrics')
            ]);
            setCycle(cycleRes.data.data);
            setCycleHistory(historyRes.data.data);
            setMetrics(metricRes.data.data);
            
            // Auto-detect if today is a rest day from plan
            if (cycleRes.data.data && !logData.routineDone) {
                const logsLength = cycleRes.data.data.logs.length;
                const configLength = cycleRes.data.data.daysConfig.length;
                if (configLength > 0) {
                    const dayIdx = logsLength % configLength;
                    const todayPlanned = cycleRes.data.data.daysConfig[dayIdx];
                    if (todayPlanned && !todayPlanned.routine) {
                        setLogData(prev => ({ ...prev, isRestDay: true }));
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load fitness data');
        } finally {
            setLoading(false);
        }
    };

    // V3.2 ANALYTICAL AVERAGING
    const getWeeklyAverage = (metricList) => {
        if (!metricList || metricList.length === 0) return null;
        const now = new Date();
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        
        const recent = metricList.filter(m => new Date(m.date) >= sevenDaysAgo);
        if (recent.length === 0) return metricList[metricList.length - 1].weight; // Fallback to last if none in 7d
        
        const sum = recent.reduce((acc, m) => acc + m.weight, 0);
        return (sum / recent.length).toFixed(1);
    };

    const weeklyAvg = useMemo(() => getWeeklyAverage(metrics), [metrics]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleSetupNext = () => {
        if (!setupData.cycleType || setupData.daysCount < 1) return toast.error('Invalid cycle details');
        let initialConfig = [];
        for (let i = 1; i <= setupData.daysCount; i++) {
            initialConfig.push({ dayNumber: i, routine: '' });
        }
        setSetupData({ ...setupData, daysConfig: initialConfig });
        setSetupStep(2);
    };

    const handleSetupSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fitness/cycle', setupData);
            setConfettiVariant('fountain');
            setShowConfetti(true);
            toast.success('Physical Split synchronized.');
            setShowSetup(false);
            fetchData();
        } catch (error) {
            toast.error('Cycle sync failed.');
        }
    };

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fitness/log', logData);
            setConfettiVariant('pulse');
            setShowConfetti(true);
            toast.success('Workout archived.');
            setLogData({ ...logData, routineDone: '', workoutCompleted: false });
            fetchData();
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error('Plan Required', {
                    description: 'Please set up your Workout Plan in the header first.'
                });
            } else {
                toast.error('Log failed.', {
                    description: error.response?.data?.message || 'Check your connection.'
                });
            }
        }
    };

    const handleMetricSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {};
            Object.keys(metricData).forEach(key => {
                if (metricData[key] !== '') payload[key] = key === 'date' ? metricData[key] : Number(metricData[key]);
            });
            await api.post('/fitness/metrics', payload);
            setConfettiVariant('fountain');
            setShowConfetti(true);
            toast.success('Bio-metrics synchronized.');
            setMetricData({ ...metricData, weight: '', bodyFat: '' }); // Partial reset
            fetchData();
        } catch (error) {
            toast.error('Metric update failed.');
        }
    };

    const handleDeleteLog = async (logId) => {
        if (!confirm('Permanent deletion of exertion node?')) return;
        try {
            await api.delete(`/fitness/log/${logId}`);
            toast.success('Node removed from timeline.');
            fetchData();
        } catch (error) {
            toast.error('Deletion failed.');
        }
    };

    const handleDeleteMetric = async (id) => {
        if (!confirm('Permanent deletion of bio-metric node?')) return;
        try {
            await api.delete(`/fitness/metrics/${id}`);
            toast.success('Bio-snapshot removed.');
            fetchData();
        } catch (error) {
            toast.error('Deletion failed.');
        }
    };

    const handleEditLog = (log) => {
        setLogData({
            date: new Date(log.date).toISOString().split('T')[0],
            isRestDay: log.isRestDay,
            workoutCompleted: log.workoutCompleted,
            routineDone: log.routineDone,
            weight: log.weight || '',
            notes: log.notes || ''
        });
        setActiveTab('workouts');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info('Workout loaded for edit.');
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
            <p className="text-sm font-black text-rose-500 uppercase tracking-widest animate-pulse">Syncing Biological Feed...</p>
        </div>
    );

    const latestMetric = metrics[metrics.length - 1] || {};
    const prevMetric = metrics[metrics.length - 2] || {};
    const weightTrend = latestMetric.weight && prevMetric.weight ? latestMetric.weight - prevMetric.weight : 0;

    return (
        <div className="min-h-screen bg-[#020204] text-[#f8fafc] font-inter antialiased px-6 md:px-12 py-10 pb-32">
            <div className="max-w-[1600px] mx-auto space-y-10">
                
                {/* NEURAL HEADER: Icon + Title (Left), Tabs (Right) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.03]">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <Activity size={24} className="pc-streak-glow" />
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Physical Wellness Engine</span>
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none font-manrope">Neural Physical</h1>
                            <p className="text-[11px] font-bold text-zinc-500 max-w-md font-inter">Advanced exertion tracking and body metric synchronization. Optimize your biological frame for maximum productivity.</p>
                        </div>
                    </div>

                        <div className="flex bg-[#0b0d12] p-1.5 rounded-2xl border border-white/[0.05] shadow-2xl">
                            <button 
                                onClick={() => setActiveTab('workouts')}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all font-inter ${activeTab === 'workouts' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {UI.WORKOUTS}
                            </button>
                            <button 
                                onClick={() => setActiveTab('body')}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all font-inter ${activeTab === 'body' ? 'bg-[#10b981] text-white shadow-xl shadow-green-500/20' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {UI.BODY}
                            </button>
                            <button 
                                onClick={() => setActiveTab('cycles')}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all font-inter ${activeTab === 'cycles' ? 'bg-zinc-700 text-white shadow-xl shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {UI.CYCLES}
                            </button>
                        </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Main Form */}
                    <div className="lg:col-span-8 space-y-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'workouts' ? (
                                <motion.div 
                                    key="workouts"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-[#151824] rounded-[2rem] border border-white/[0.03] overflow-hidden shadow-2xl relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-0" />
                                        <Card className="bg-transparent border-none p-10 relative z-10 space-y-10">
                                            <div className="flex items-center gap-4">
                                                <Dumbbell size={20} className="text-indigo-500" />
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none font-manrope">Exertion Log</h3>
                                            </div>

                                            <form onSubmit={handleLogSubmit} className="space-y-10">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Cycle Date</label>
                                                        <input type="date" className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-indigo-500 text-sm font-bold transition-all text-white" value={logData.date} onChange={e => setLogData({...logData, date: e.target.value})} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Current Weight (KG)</label>
                                                        <input type="number" step="0.1" className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-indigo-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={logData.weight} onChange={e => setLogData({...logData, weight: e.target.value})} placeholder="e.g. 82.5" />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8 bg-[#0b0d12] p-6 rounded-2xl border border-white/[0.03]">
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <input type="checkbox" className="hidden" checked={logData.isRestDay} onChange={e => setLogData({...logData, isRestDay: e.target.checked})} />
                                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${logData.isRestDay ? 'bg-indigo-600 border-indigo-600' : 'border-white/10 group-hover:border-white/20'}`}>
                                                            {logData.isRestDay && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={`text-[11px] font-black uppercase tracking-widest ${logData.isRestDay ? 'text-indigo-500' : 'text-zinc-600 hover:text-zinc-400'}`}>Rest Day</span>
                                                    </label>

                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <input type="checkbox" className="hidden" checked={logData.workoutCompleted} onChange={e => setLogData({...logData, workoutCompleted: e.target.checked})} />
                                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${logData.workoutCompleted ? 'bg-green-600 border-green-600' : 'border-white/10 group-hover:border-white/20'}`}>
                                                            {logData.workoutCompleted && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={`text-[11px] font-black uppercase tracking-widest ${logData.workoutCompleted ? 'text-green-500' : 'text-zinc-600 hover:text-zinc-400'}`}>Exertion Complete</span>
                                                    </label>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Routine Detail</label>
                                                    <input className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-indigo-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={logData.routineDone} onChange={e => setLogData({...logData, routineDone: e.target.value})} placeholder="e.g. PUSH - Heavy Chest Focus" />
                                                </div>

                                                <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]">Archive Exertion Node</button>
                                            </form>
                                        </Card>
                                    </div>

                                    {/* TIMELINE */}
                                    <div className="space-y-6 pt-4">
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-2 font-inter">Exertion Timeline</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {cycle?.logs.slice().reverse().map((log) => (
                                                <Card key={log._id} className="bg-[#151824] p-6 flex items-center justify-between transition-all hover:border-white/10 border-white/[0.03] rounded-2xl">
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${log.isRestDay ? 'bg-zinc-800 border-white/5 text-zinc-500' : 'bg-indigo-600/5 border-indigo-500/10 text-indigo-500'}`}>
                                                            {log.isRestDay ? <Activity size={20} /> : <Dumbbell size={20} />}
                                                        </div>
                                                        <div>
                                                            <div className="text-base font-black text-white uppercase tracking-tighter">{log.routineDone || (log.isRestDay ? 'Recovery' : 'Workout')}</div>
                                                            <div className="text-[9px] font-black text-zinc-600 flex items-center gap-3 mt-1.5 uppercase tracking-widest">
                                                                <span>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                                                <span className="text-zinc-500">{log.weight}KG</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-all">
                                                        <button onClick={() => handleEditLog(log)} className="p-3 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all"><Edit2 size={12} /></button>
                                                        <button onClick={() => handleDeleteLog(log._id)} className="p-3 rounded-xl hover:bg-red-500/5 text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={12} /></button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : activeTab === 'body' ? (
                                <motion.div 
                                    key="body"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-[#151824] rounded-[2rem] border border-white/[0.03] overflow-hidden shadow-2xl relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl -z-0" />
                                        <Card className="bg-transparent border-none p-10 relative z-10 space-y-10">
                                            <div className="flex items-center gap-4">
                                                <Scale size={20} className="text-[#10b981]" />
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none font-manrope">Biological Snapshot</h3>
                                            </div>

                                            <form onSubmit={handleMetricSubmit} className="space-y-10">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Stomach (CM)</label>
                                                        <input type="number" step="0.1" className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-green-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={metricData.stomach} onChange={e => setMetricData({...metricData, stomach: e.target.value})} placeholder="0.0" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Arm (CM)</label>
                                                        <input type="number" step="0.1" className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-green-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={metricData.arm} onChange={e => setMetricData({...metricData, arm: e.target.value})} placeholder="0.0" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Leg (CM)</label>
                                                        <input type="number" step="0.1" className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-green-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={metricData.leg} onChange={e => setMetricData({...metricData, leg: e.target.value})} placeholder="0.0" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Body Fat (%)</label>
                                                        <input type="number" step="0.1" className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-green-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={metricData.bodyFat} onChange={e => setMetricData({...metricData, bodyFat: e.target.value})} placeholder="0.0" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Muscle (%)</label>
                                                        <input type="number" step="0.1" className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-green-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={metricData.muscleMass} onChange={e => setMetricData({...metricData, muscleMass: e.target.value})} placeholder="0.0" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">BMR (KCAL)</label>
                                                        <input type="number" className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-green-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={metricData.bmr} onChange={e => setMetricData({...metricData, bmr: e.target.value})} placeholder="0" />
                                                    </div>
                                                </div>

                                                <button type="submit" className="w-full py-5 bg-[#10b981] text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-[#0da271] transition-all shadow-xl shadow-green-500/20 active:scale-[0.98]">Sync Biological Metrics</button>
                                            </form>
                                        </Card>
                                    </div>

                                    {/* BIOMETRIC HISTORY */}
                                    <div className="space-y-6 pt-4">
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-2 font-inter">Snapshot History</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {metrics.slice().reverse().map((m) => (
                                                <Card key={m._id} className="bg-[#151824] p-5 px-7 flex items-center justify-between transition-all hover:border-white/10 border-white/[0.03] rounded-2xl">
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-center w-14 py-1.5 shrink-0 bg-[#0b0d12] rounded-xl border border-white/5">
                                                            <div className="text-xl font-black text-white leading-none font-manrope">{m.weight}</div>
                                                            <div className="text-[7px] font-black text-zinc-600 uppercase mt-0.5">KG</div>
                                                        </div>
                                                        <div className="w-[1px] h-8 bg-white/[0.03]" />
                                                        <div>
                                                            <div className="text-[11px] font-black text-white uppercase tracking-tight">{new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                            <div className="text-[9px] font-bold text-[#10b981]/60 mt-1 uppercase tracking-widest">{m.bodyFat || '--'}% ADIPOSE INDEX</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-all">
                                                        <button onClick={() => {
                                                            setMetricData({
                                                                date: new Date(m.date).toISOString().split('T')[0],
                                                                weight: m.weight || '',
                                                                bmr: m.bmr || '',
                                                                muscleMass: m.muscleMass || '',
                                                                bodyFat: m.bodyFat || '',
                                                                stomach: m.stomach || '',
                                                                arm: m.arm || '',
                                                                leg: m.leg || ''
                                                            });
                                                            toast.info('Snapshot loaded for refinement.');
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }} className="p-3 rounded-xl hover:bg-white/5 text-zinc-500 transition-all"><Edit2 size={12} /></button>
                                                        <button onClick={() => handleDeleteMetric(m._id)} className="p-3 rounded-xl hover:bg-red-500/5 text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={12} /></button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="cycles"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-2 font-inter">Protocol Archives</h4>
                                        <div className="grid grid-cols-1 gap-6">
                                            {cycleHistory.length === 0 ? (
                                                <div className="bg-[#151824] p-16 rounded-[2rem] border border-white/[0.03] text-center space-y-4">
                                                    <Layers size={40} className="mx-auto text-zinc-800" />
                                                    <div className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No Archived Protocols Detected</div>
                                                </div>
                                            ) : (
                                                cycleHistory.map((h) => (
                                                    <Card key={h._id} className={`bg-[#151824] p-8 border-white/[0.03] rounded-[2rem] relative overflow-hidden group transition-all hover:border-white/10 ${h.active ? 'ring-2 ring-indigo-500/20' : ''}`}>
                                                        {h.active && <div className="absolute top-0 right-0 px-6 py-2 bg-indigo-600 text-[8px] font-black uppercase tracking-widest text-white rounded-bl-2xl">Active Protocol</div>}
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${h.active ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-500' : 'bg-zinc-800/50 border-white/5 text-zinc-500'}`}>
                                                                        <Target size={20} />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter font-manrope">{h.cycleType}</h3>
                                                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{h.daysCount} Day Optimized Split</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-12">
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-black text-white font-manrope tracking-tighter">{h.logs.length}</div>
                                                                    <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Exertion Nodes</div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-[10px] font-black text-white uppercase tracking-tight">{new Date(h.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                                                                    <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Initialization</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* CURRENT SPLIT */}
                        <div className="bg-[#151824] rounded-[2rem] border border-white/[0.03] p-10 space-y-8 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-600/5 blur-3xl -z-0 group-hover:bg-indigo-600/10 transition-all duration-700" />
                           <div className="flex items-center gap-4 relative z-10">
                               <Layers size={18} className="text-zinc-600" />
                               <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-none font-inter">Current Split</h4>
                           </div>
                           
                           <div className="relative z-10 space-y-2">
                               <div className="text-2xl font-black text-white uppercase tracking-tighter transition-all group-hover:text-indigo-400 duration-500">
                                   {cycle?.cycleType || 'Standby Mode'}
                               </div>
                               <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                   {cycle ? `Day ${(cycle.logs.length % cycle.daysConfig.length) + 1} of ${cycle.daysConfig.length} Cycle` : 'Initialize Protocol to Begin'}
                               </p>
                           </div>

                           <button 
                                onClick={() => setShowSetup(true)}
                                className="w-full py-4 bg-[#0b0d12] border border-white/[0.05] rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hover:bg-white/[0.02] hover:text-white transition-all relative z-10"
                           >
                                Modify Protocol
                           </button>
                        </div>

                        {/* NEURAL INSIGHT */}
                        <div className="bg-[#151824] rounded-[2rem] border border-white/[0.03] p-10 space-y-8 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 blur-3xl -z-0 group-hover:bg-green-500/10 transition-all duration-700" />
                           <div className="flex items-center gap-4 relative z-10">
                               <TrendingUp size={18} className="text-green-500" />
                               <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-none font-inter">Neural Insight</h4>
                           </div>
                           
                           <p className="text-[11px] font-bold text-zinc-500 leading-relaxed relative z-10">
                               Exertion detected on {cycle?.logs.filter(l => l.workoutCompleted).length || 0} of the last 7 cycles. 
                               Body composition shifting towards leaner muscle density. Optimal recovery phase initiated.
                           </p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SUMMARY ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
                    <div className="bg-[#151824] p-8 rounded-[1.5rem] border border-white/[0.03] space-y-3 group hover:border-white/10 transition-all">
                        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Consistency</div>
                        <div className="text-3xl font-black text-white italic tracking-tighter group-hover:text-indigo-500 transition-all font-manrope">0%</div>
                    </div>
                    <div className="bg-[#151824] p-8 rounded-[1.5rem] border border-white/[0.03] space-y-3 group hover:border-white/10 transition-all">
                        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Active Cycle</div>
                        <div className="text-2xl font-black text-indigo-500 uppercase tracking-tighter leading-none pt-1 font-manrope">Standby</div>
                    </div>
                    <div className="bg-[#151824] p-8 rounded-[1.5rem] border border-white/[0.03] space-y-3 group hover:border-white/10 transition-all">
                        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Current Weight</div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-black text-white tracking-tighter font-manrope">{latestMetric.weight || '--'}</div>
                            <div className="text-[9px] font-black text-zinc-700 uppercase">KG</div>
                        </div>
                    </div>
                    <div className="bg-[#151824] p-8 rounded-[1.5rem] border border-white/[0.03] space-y-3 group hover:border-white/10 transition-all">
                        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Body Fat</div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-black text-white tracking-tighter font-manrope">{latestMetric.bodyFat || '--'}</div>
                            <div className="text-[9px] font-black text-zinc-700 uppercase">%</div>
                        </div>
                    </div>
                </div>

            {/* PROTOCOL MODAL */}
            <AnimatePresence>
                {showSetup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#151824] w-full max-w-xl rounded-[2.5rem] border border-white/[0.1] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10 space-y-12">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none font-manrope">Modify Protocol</h3>
                                    <button onClick={() => setShowSetup(false)} className="w-10 h-10 flex items-center justify-center bg-white/[0.03] hover:bg-white/10 rounded-full transition-all text-zinc-500"><Plus size={24} className="rotate-45" /></button>
                                </div>

                                {setupStep === 1 ? (
                                    <div className="space-y-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Plan Identity</label>
                                            <input className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-indigo-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={setupData.cycleType} onChange={e => setSetupData({...setupData, cycleType: e.target.value})} placeholder="e.g. Mass Protocol Phase 1" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Rotation Duration (Days)</label>
                                            <input type="number" min="1" className="w-full bg-[#0b0d12] p-5 rounded-2xl border border-white/[0.05] outline-none focus:border-indigo-500 text-sm font-bold transition-all text-white placeholder:text-zinc-800" value={setupData.daysCount} onChange={e => setSetupData({...setupData, daysCount: Number(e.target.value)})} />
                                        </div>
                                        <button onClick={handleSetupNext} className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Configure Layers</button>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        <div className="max-h-[350px] overflow-y-auto space-y-3 pr-4 custom-scrollbar">
                                            {setupData.daysConfig.map((day, idx) => (
                                                <div key={idx} className="flex items-center gap-5 bg-[#0b0d12] p-3 rounded-xl border border-white/[0.03]">
                                                    <div className="w-12 h-12 rounded-lg bg-zinc-900 flex flex-col items-center justify-center shrink-0 border border-white/5">
                                                        <span className="text-[7px] font-black text-zinc-600">D</span>
                                                        <span className="text-base font-black text-white leading-none">{day.dayNumber}</span>
                                                    </div>
                                                    <input 
                                                        className="flex-1 bg-transparent p-2 outline-none font-bold text-sm tracking-tight text-white" 
                                                        placeholder="Target Focus (or Rest)"
                                                        value={day.routine}
                                                        onChange={e => {
                                                            const updated = [...setupData.daysConfig];
                                                            updated[idx].routine = e.target.value;
                                                            setSetupData({ ...setupData, daysConfig: updated });
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => setSetupStep(1)} className="flex-1 py-5 bg-zinc-900 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all">Back</button>
                                            <button onClick={handleSetupSubmit} className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Activate Plan</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

                <Confetti active={showConfetti} theme="wellness" variant={confettiVariant} onComplete={() => setShowConfetti(false)} />
            </div>
        </div>
    );
}
