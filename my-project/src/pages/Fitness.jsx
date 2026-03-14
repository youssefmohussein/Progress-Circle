import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, Dumbbell, TrendingUp, Scale, 
    ChevronRight, Plus, Trash2, Calendar, 
    Zap, Target, Layers, Ruler
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { toast } from 'sonner';

export function Fitness() {
    const { user } = useAuth();
    const [cycle, setCycle] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('workout'); // 'workout' or 'metrics'

    // Form/Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Wizard Setup 
    const [showSetup, setShowSetup] = useState(false);
    const [setupStep, setSetupStep] = useState(1);
    const [setupData, setSetupData] = useState({ cycleType: 'Hypertrophy Phase 1', daysCount: 4, daysConfig: [] });

    // Daily Logger
    const [logData, setLogData] = useState({
        date: new Date().toISOString().split('T')[0],
        isRestDay: false,
        workoutCompleted: false,
        routineDone: '',
        weight: '',
        notes: ''
    });

    // Body Metrics Logger
    const [metricData, setMetricData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '', bmr: '', muscleMass: '', bodyFat: '', stomach: '', arm: '', leg: ''
    });

    const fetchData = async () => {
        try {
            const [cycleRes, metricRes] = await Promise.all([
                api.get('/fitness/cycle'),
                api.get('/fitness/metrics')
            ]);
            setCycle(cycleRes.data.data);
            setMetrics(metricRes.data.data);
        } catch (error) {
            console.error('Failed to load fitness data');
        } finally {
            setLoading(false);
        }
    };

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
            toast.success('Daily exertion node archived.');
            setLogData({ ...logData, routineDone: '', workoutCompleted: false });
            fetchData();
        } catch (error) {
            toast.error('Log failed.');
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
            toast.success('Biological metrics updated.');
            fetchData();
        } catch (error) {
            toast.error('Metric update failed.');
        }
    };

    if (loading) return <div className="p-8 text-center text-muted">Scanning biological exertion logs...</div>;

    return (
        <div className="space-y-6 max-w-6xl pb-20">
            {/* Header section */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="pc-card overflow-hidden bg-gradient-to-br from-indigo-500/10 to-transparent"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 mb-1">
                            <Activity size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Physical Wellness Engine</span>
                        </div>
                        <h2 className="text-3xl font-black text-text">Neural Physical</h2>
                        <p className="text-sm text-muted max-w-md mt-1">
                            Advanced exertion tracking and body metric synchronization. Optimize your biological frame for maximum productivity.
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => { setActiveTab('workout') }}
                            className={`px-4 py-2 rounded-xl border transition-all text-xs font-bold ${activeTab === 'workout' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-surface2 text-muted border-border/10'}`}
                        >
                            Workout Splits
                        </button>
                        <button 
                            onClick={() => { setActiveTab('metrics') }}
                            className={`px-4 py-2 rounded-xl border transition-all text-xs font-bold ${activeTab === 'metrics' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-surface2 text-muted border-border/10'}`}
                        >
                            Body Metrics
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Logger / Form */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'workout' ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pc-card p-6">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                                <Dumbbell className="text-indigo-400" size={20} /> Exertion Log
                            </h3>
                            <form onSubmit={handleLogSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Cycle Date</label>
                                        <input type="date" className="w-full bg-surface2 border border-border/10 p-3 rounded-xl text-sm outline-none focus:border-indigo-500" value={logData.date} onChange={e => setLogData({...logData, date: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Current Weight (kg)</label>
                                        <input type="number" step="0.1" className="w-full bg-surface2 border border-border/10 p-3 rounded-xl text-sm outline-none focus:border-indigo-500" placeholder="e.g. 82.5" value={logData.weight} onChange={e => setLogData({...logData, weight: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={logData.isRestDay} onChange={e => setLogData({...logData, isRestDay: e.target.checked})} className="rounded pc-checkbox" />
                                        <span className="text-xs font-bold uppercase text-indigo-400">Rest Day</span>
                                    </label>
                                    {!logData.isRestDay && (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={logData.workoutCompleted} onChange={e => setLogData({...logData, workoutCompleted: e.target.checked})} className="rounded pc-checkbox" />
                                            <span className="text-xs font-bold uppercase text-emerald-400">Exertion Complete</span>
                                        </label>
                                    )}
                                </div>

                                {!logData.isRestDay && (
                                    <div className="p-4 rounded-xl bg-surface2 border border-border/5">
                                        <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Routine Detail</label>
                                        <input 
                                            placeholder="e.g. PUSH - Heavy Chest Focus" 
                                            className="w-full bg-transparent text-sm font-bold outline-none"
                                            value={logData.routineDone}
                                            onChange={e => setLogData({...logData, routineDone: e.target.value})}
                                        />
                                    </div>
                                )}

                                <button type="submit" className="w-full py-4 bg-indigo-500 rounded-xl font-black text-sm text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
                                    ARCHIVE EXERTION NODE
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pc-card p-6">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                                <Scale className="text-emerald-400" size={20} /> Biological Snapshot
                            </h3>
                            <form onSubmit={handleMetricSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-surface2 border border-border/5">
                                        <label className="text-[9px] font-black text-muted uppercase block mb-1">Stomach (cm)</label>
                                        <input type="number" step="0.1" className="bg-transparent w-full text-sm font-bold outline-none" placeholder="0.0" value={metricData.stomach} onChange={e => setMetricData({...metricData, stomach: e.target.value})} />
                                    </div>
                                    <div className="p-4 rounded-xl bg-surface2 border border-border/5">
                                        <label className="text-[9px] font-black text-muted uppercase block mb-1">Arm (cm)</label>
                                        <input type="number" step="0.1" className="bg-transparent w-full text-sm font-bold outline-none" placeholder="0.0" value={metricData.arm} onChange={e => setMetricData({...metricData, arm: e.target.value})} />
                                    </div>
                                    <div className="p-4 rounded-xl bg-surface2 border border-border/5">
                                        <label className="text-[9px] font-black text-muted uppercase block mb-1">Leg (cm)</label>
                                        <input type="number" step="0.1" className="bg-transparent w-full text-sm font-bold outline-none" placeholder="0.0" value={metricData.leg} onChange={e => setMetricData({...metricData, leg: e.target.value})} />
                                    </div>
                                    <div className="p-4 rounded-xl bg-surface2 border border-border/5">
                                        <label className="text-[9px] font-black text-muted uppercase block mb-1">Body Fat (%)</label>
                                        <input type="number" step="0.1" className="bg-transparent w-full text-sm font-bold outline-none" placeholder="0.0" value={metricData.bodyFat} onChange={e => setMetricData({...metricData, bodyFat: e.target.value})} />
                                    </div>
                                    <div className="p-4 rounded-xl bg-surface2 border border-border/5">
                                        <label className="text-[9px] font-black text-muted uppercase block mb-1">Muscle (%)</label>
                                        <input type="number" step="0.1" className="bg-transparent w-full text-sm font-bold outline-none" placeholder="0.0" value={metricData.muscleMass} onChange={e => setMetricData({...metricData, muscleMass: e.target.value})} />
                                    </div>
                                    <div className="p-4 rounded-xl bg-surface2 border border-border/5">
                                        <label className="text-[9px] font-black text-muted uppercase block mb-1">BMR (kcal)</label>
                                        <input type="number" className="bg-transparent w-full text-sm font-bold outline-none" placeholder="0" value={metricData.bmr} onChange={e => setMetricData({...metricData, bmr: e.target.value})} />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-emerald-500 rounded-xl font-black text-sm text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                                    SYNC BIOLOGICAL METRICS
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Dashboard Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="pc-card p-4">
                            <div className="text-[10px] font-black text-muted uppercase mb-1">Consistency</div>
                            <div className="text-xl font-black">
                                {cycle?.logs.length > 0 ? Math.round((cycle.logs.filter(l => l.workoutCompleted || l.isRestDay).length / cycle.logs.length) * 100) : 0}%
                            </div>
                        </div>
                        <div className="pc-card p-4">
                            <div className="text-[10px] font-black text-muted uppercase mb-1">Active Cycle</div>
                            <div className="text-sm font-bold text-indigo-400 truncate">{cycle?.cycleType || 'Standby'}</div>
                        </div>
                        <div className="pc-card p-4">
                            <div className="text-[10px] font-black text-muted uppercase mb-1">Current Weight</div>
                            <div className="text-xl font-black">{metrics[metrics.length-1]?.weight || '--'} <span className="text-[10px] text-muted font-normal">kg</span></div>
                        </div>
                        <div className="pc-card p-4">
                            <div className="text-[10px] font-black text-muted uppercase mb-1">Body Fat</div>
                            <div className="text-xl font-black">{metrics[metrics.length-1]?.bodyFat || '--'} <span className="text-[10px] text-muted font-normal">%</span></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: History / Sidebar */}
                <div className="space-y-6">
                    {/* Active Split Visualization */}
                    <div className="pc-card p-5 bg-surface2">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                             <Layers size={14} className="text-indigo-400" /> Current Split
                        </h3>
                        <div className="space-y-2">
                            {cycle?.daysConfig.map((day) => (
                                <div key={day.dayNumber} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all text-xs">
                                    <span className="text-muted font-bold w-12 text-[10px]">DAY {day.dayNumber}</span>
                                    <span className="font-bold flex-1 ml-4 truncate text-right">{day.routine}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => { setSetupStep(1); setShowSetup(true); }} className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                            Modify Protocol
                        </button>
                    </div>

                    <div className="pc-card p-5">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <TrendingUp size={14} className="text-emerald-400" /> Neural Insight
                        </h3>
                        <p className="text-[11px] text-muted leading-relaxed">
                            Exertion detected on 5 of the last 7 cycles. Body composition shifting towards leaner muscle density. Optimal recovery phase initiated.
                        </p>
                    </div>
                </div>
            </div>

            {/* Cycle Setup Modal */}
            <AnimatePresence>
                {showSetup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface pc-card p-6 w-full max-w-lg shadow-2xl">
                            <h3 className="text-xl font-black mb-6">Physical Protocol Configuration</h3>
                            {setupStep === 1 ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-muted uppercase block mb-1">Cycle Strategy Name</label>
                                        <input className="w-full bg-surface2 p-3 rounded-xl border border-border/10 outline-none" value={setupData.cycleType} onChange={e => setSetupData({...setupData, cycleType: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-muted uppercase block mb-1">Cycle Length (Days)</label>
                                        <input type="number" min="1" className="w-full bg-surface2 p-3 rounded-xl border border-border/10 outline-none" value={setupData.daysCount} onChange={e => setSetupData({...setupData, daysCount: Number(e.target.value)})} />
                                    </div>
                                    <button onClick={handleSetupNext} className="w-full py-3 bg-indigo-500 text-white font-black rounded-xl hover:bg-indigo-600 transition-all">NEXT LAYER</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                                        {setupData.daysConfig.map((day, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <span className="w-12 text-[10px] font-black text-muted">DAY {day.dayNumber}</span>
                                                <input 
                                                    className="flex-1 bg-surface2 p-2 rounded-lg border border-border/5 text-sm" 
                                                    placeholder="Target Routine..."
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
                                    <div className="flex gap-3 pt-4">
                                        <button onClick={() => setSetupStep(1)} className="flex-1 py-3 bg-surface2 rounded-xl font-bold">BACK</button>
                                        <button onClick={handleSetupSubmit} className="flex-1 py-3 bg-indigo-500 text-white font-black rounded-xl">INITIATE SPLIT</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
