import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Dumbbell, Utensils, Save, TrendingUp, Scale, ChevronRight, Plus, Trash2, Edit2, Calendar, Crown, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
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
    const [setupData, setSetupData] = useState({ cycleType: 'Customized', daysCount: 7, daysConfig: [] });

    // Daily Logger
    const [logData, setLogData] = useState({
        date: new Date().toISOString().split('T')[0],
        isRestDay: false,
        workoutCompleted: false,
        routineDone: '',
        weight: '',
        meals: [{ mealName: 'Breakfast', items: '' }],
        notes: ''
    });

    // Body Metrics Logger
    const [metricData, setMetricData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '', bmr: '', muscleMass: '', bodyFat: '', stomach: '', arm: '', leg: ''
    });

    const fetchData = async () => {
        if (user?.plan !== 'premium') {
            setLoading(false);
            return;
        }
        try {
            const [cycleRes, metricRes] = await Promise.all([
                api.get('/fitness/cycle'),
                api.get('/fitness/metrics')
            ]);
            setCycle(cycleRes.data.data);
            setMetrics(metricRes.data.data);
        } catch (error) {
            toast.error('Failed to load fitness data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetLogForm = () => {
        setLogData({
            date: new Date().toISOString().split('T')[0],
            isRestDay: false,
            workoutCompleted: false,
            routineDone: '',
            weight: '',
            meals: [{ mealName: 'Breakfast', items: '' }],
            notes: ''
        });
        setIsEditing(false);
        setEditId(null);
    };

    const handleAddMeal = () => {
        setLogData(prev => ({
            ...prev,
            meals: [...prev.meals, { mealName: `Meal ${prev.meals.length + 1}`, items: '' }]
        }));
    };

    const handleRemoveMeal = (index) => {
        if (logData.meals.length <= 1) return;
        const newMeals = [...logData.meals];
        newMeals.splice(index, 1);
        setLogData(prev => ({ ...prev, meals: newMeals }));
    };

    const handleMealChange = (index, field, value) => {
        const newMeals = [...logData.meals];
        newMeals[index][field] = value;
        setLogData(prev => ({ ...prev, meals: newMeals }));
    };

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
            toast.success('Fitness cycle setup complete!');
            setShowSetup(false);
            setSetupStep(1);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to setup cycle');
        }
    };

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fitness/log', logData);
            toast.success(isEditing ? 'Log updated!' : 'Daily fitness logged!');
            resetLogForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save log');
        }
    };

    const handleDeleteLog = async (id) => {
        if (!window.confirm('Are you sure you want to delete this log?')) return;
        try {
            await api.delete(`/fitness/log/${id}`);
            toast.success('Log deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete log');
        }
    };

    const handleEditLog = (log) => {
        setLogData({
            date: new Date(log.date).toISOString().split('T')[0],
            isRestDay: log.isRestDay,
            workoutCompleted: log.workoutCompleted,
            routineDone: log.routineDone || '',
            weight: log.weight || '',
            meals: log.meals?.length > 0 ? log.meals : [{ mealName: 'Breakfast', items: '' }],
            notes: log.notes || ''
        });
        setIsEditing(true);
        setEditId(log._id);
        setActiveTab('workout');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMetricSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {};
            Object.keys(metricData).forEach(key => {
                if (metricData[key] !== '') payload[key] = key === 'date' ? metricData[key] : Number(metricData[key]);
            });
            await api.post('/fitness/metrics', payload);
            toast.success('Body metrics logged!');
            setMetricData({ date: new Date().toISOString().split('T')[0], weight: '', bmr: '', muscleMass: '', bodyFat: '', stomach: '', arm: '', leg: '' });
            fetchData();
        } catch (error) {
            toast.error('Failed to log metrics');
        }
    }

    const handleDeleteMetric = async (id) => {
        if (!window.confirm('Delete this measurement?')) return;
        try {
            await api.delete(`/fitness/metrics/${id}`);
            toast.success('Deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    if (loading) return <LoadingSpinner />;

    // Premium Gating Overlay
    if (user?.plan !== 'premium') {
        return (
            <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl">
                {/* Blurred Preview Background */}
                <div className="absolute inset-0 opacity-20 blur-xl pointer-events-none select-none grayscale">
                    <div className="p-10 space-y-8">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="h-20 bg-white/10 rounded-2xl" />
                            <div className="h-20 bg-white/10 rounded-2xl" />
                            <div className="h-20 bg-white/10 rounded-2xl" />
                            <div className="h-20 bg-white/10 rounded-2xl" />
                        </div>
                        <div className="h-96 bg-white/10 rounded-3xl" />
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 max-w-md w-full p-8 text-center bg-surface/80 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <Dumbbell size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-3">Fitness Lab is Premium</h2>
                    <p className="text-muted text-sm leading-relaxed mb-8">
                        Level up your physical wellness. Track custom training cycles, log every meal, and monitor detailed body metrics as you transform.
                    </p>
                    
                    <div className="space-y-3 mb-8">
                        {[
                            'Custom Training Cycles',
                            'Detailed Daily Workout Logs',
                            'Calorie & Meal Tracking',
                            'Body Metric History Charts'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-white/70 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {feature}
                            </div>
                        ))}
                    </div>

                    <Link to="/pricing">
                        <Button className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20 border-none transition-all">
                            Start Journey Now
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!cycle || showSetup) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <Activity size={48} className="mx-auto text-indigo-500 mb-4" />
                    <h1 className="text-2xl font-bold text-white">Fitness Tracking Setup</h1>
                    <p className="text-muted mt-2">Build your custom training cycle.</p>
                </div>

                <Card>
                    {setupStep === 1 ? (
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Cycle Name / Strategy</label>
                                <input type="text" placeholder="e.g. Push/Pull/Legs" className="pc-input w-full" value={setupData.cycleType} onChange={e => setSetupData({ ...setupData, cycleType: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">How many days in the cycle?</label>
                                <input type="number" min="1" className="pc-input w-full" value={setupData.daysCount} onChange={e => setSetupData({ ...setupData, daysCount: Number(e.target.value) })} />
                            </div>
                            <Button type="button" className="w-full" onClick={handleSetupNext}>Next Step <ChevronRight size={16} className="ml-2" /></Button>
                            {cycle && <Button type="button" variant="secondary" className="w-full mt-2" onClick={() => setShowSetup(false)}>Cancel</Button>}
                        </form>
                    ) : (
                        <form onSubmit={handleSetupSubmit} className="space-y-4">
                            <h3 className="font-bold text-white mb-2">Define Routine for Each Day</h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {setupData.daysConfig.map((day, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-20 font-medium text-sm text-muted shrink-0">Day {day.dayNumber}</div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Chest (Push), Rest..."
                                            className="pc-input w-full py-1.5"
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
                            <div className="flex gap-3 pt-4 border-t border-white/5">
                                <Button type="button" variant="secondary" className="flex-1" onClick={() => setSetupStep(1)}>Back</Button>
                                <Button type="submit" className="flex-1">Finish & Start Cycle</Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold font-manrope text-white mb-1">Fitness Tracking</h1>
                    <p className="text-muted">History, Meals & Progress</p>
                </div>
                <Button variant="secondary" onClick={() => { setSetupStep(1); setShowSetup(true); }}>
                    Edit Cycle
                </Button>
            </div>

            <div className="flex gap-2 p-1 bg-surface-2 rounded-xl w-fit">
                <button onClick={() => setActiveTab('workout')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'workout' ? 'bg-indigo-500 text-white' : 'text-muted hover:text-white'}`}>Workout Log</button>
                <button onClick={() => setActiveTab('metrics')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'metrics' ? 'bg-indigo-500 text-white' : 'text-muted hover:text-white'}`}>Body Metrics</button>
            </div>

            {activeTab === 'workout' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="py-4 border-l-4 border-indigo-500">
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Consistency</div>
                        <div className="text-2xl font-bold text-white">
                            {cycle.logs.length > 0
                                ? Math.round((cycle.logs.filter(l => l.workoutCompleted || l.isRestDay).length / cycle.logs.length) * 100)
                                : 0}%
                        </div>
                    </Card>
                    <Card className="py-4">
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Total Logs</div>
                        <div className="text-2xl font-bold text-indigo-400">{cycle.logs.length}</div>
                    </Card>
                    <Card className="py-4">
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Cycle Day</div>
                        <div className="text-2xl font-bold text-emerald-400">
                            {Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(cycle.createdAt).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)) % cycle.daysCount + 1}
                        </div>
                    </Card>
                    <Card className="py-4">
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Active Cycle</div>
                        <div className="text-xs font-bold text-white truncate px-1">{cycle.cycleType}</div>
                    </Card>
                </div>
            )}

            {activeTab === 'metrics' && metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="py-4 border-l-4 border-emerald-500">
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Weight</div>
                        <div className="text-2xl font-bold text-white">
                            {metrics[metrics.length - 1].weight || '--'} <span className="text-[10px] font-normal text-muted">kg</span>
                        </div>
                    </Card>
                    <Card className="py-4">
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Body Fat</div>
                        <div className="text-2xl font-bold text-indigo-400">
                            {metrics[metrics.length - 1].bodyFat || '--'} <span className="text-[10px] font-normal text-muted">%</span>
                        </div>
                    </Card>
                    <Card className="py-4">
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Muscle Mass</div>
                        <div className="text-2xl font-bold text-emerald-400">
                            {metrics[metrics.length - 1].muscleMass || '--'} <span className="text-[10px] font-normal text-muted">%</span>
                        </div>
                    </Card>
                    <Card className="py-4">
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">BMR</div>
                        <div className="text-2xl font-bold text-orange-400">
                            {metrics[metrics.length - 1].bmr || '--'} <span className="text-[10px] font-normal text-muted">kcal</span>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'workout' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    {isEditing ? <Edit2 size={18} className="text-orange-400" /> : <Dumbbell size={18} className="text-indigo-400" />}
                                    {isEditing ? 'Update Past Log' : "Log Today's Workout"}
                                </h2>
                                {isEditing && <button onClick={resetLogForm} className="text-xs text-muted hover:text-white underline">Cancel Edit</button>}
                            </div>

                            <form onSubmit={handleLogSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Date</label>
                                        <input type="date" required className="pc-input w-full" value={logData.date} onChange={e => setLogData({ ...logData, date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Weight</label>
                                        <input type="number" step="0.1" placeholder="Optional" className="pc-input w-full" value={logData.weight} onChange={e => setLogData({ ...logData, weight: e.target.value })} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-3 bg-surface-2 rounded-xl border border-white/5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={logData.isRestDay} onChange={e => setLogData({ ...logData, isRestDay: e.target.checked })} className="rounded pc-checkbox" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-white/70">Rest Day</span>
                                    </label>
                                    {!logData.isRestDay && (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={logData.workoutCompleted} onChange={e => setLogData({ ...logData, workoutCompleted: e.target.checked })} className="rounded pc-checkbox" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Completed</span>
                                        </label>
                                    )}
                                </div>

                                {!logData.isRestDay && (
                                    <div>
                                        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Workout / Routine Name</label>
                                        <input type="text" placeholder="e.g. Chest & Triceps" className="pc-input w-full" value={logData.routineDone} onChange={e => setLogData({ ...logData, routineDone: e.target.value })} />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Meals Log</label>
                                        <button type="button" onClick={handleAddMeal} className="text-xs text-indigo-400 flex items-center gap-1 font-bold hover:text-indigo-300">
                                            <Plus size={14} /> Add Meal
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {logData.meals.map((meal, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className="w-32 shrink-0">
                                                    <input
                                                        type="text"
                                                        placeholder="Meal Name"
                                                        className="pc-input w-full text-xs"
                                                        value={meal.mealName}
                                                        onChange={e => handleMealChange(idx, 'mealName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex-1 relative">
                                                    <textarea
                                                        placeholder="What did you eat? (Chicken, Rice, Eggs...)"
                                                        className="pc-input w-full text-xs pr-8 min-h-[40px] py-2 scrollbar-none"
                                                        rows="1"
                                                        value={meal.items}
                                                        onChange={e => handleMealChange(idx, 'items', e.target.value)}
                                                    />
                                                    {logData.meals.length > 1 && (
                                                        <button type="button" onClick={() => handleRemoveMeal(idx)} className="absolute right-2 top-2.5 text-red-500/50 hover:text-red-500">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full">
                                    <Save size={16} className="mr-2" /> {isEditing ? 'Update Log' : 'Save Daily Log'}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-lg font-bold text-white mb-4">Workout History</h2>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {cycle.logs.length === 0 ? (
                                    <p className="text-sm text-muted text-center py-6">No logs yet.</p>
                                ) : (
                                    [...cycle.logs].sort((a, b) => new Date(b.date) - new Date(a.date)).map(log => (
                                        <div key={log._id} className="p-4 bg-surface-2 rounded-xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 cursor-pointer" onClick={() => handleEditLog(log)}>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-sm text-white">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                                        {log.weight && <span className="text-[10px] font-bold text-indigo-300">({log.weight}kg)</span>}
                                                    </div>
                                                    <p className="text-[10px] uppercase font-bold text-indigo-400 mt-1">{log.isRestDay ? 'Rest Day' : (log.routineDone || 'Workout')}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${log.workoutCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                                                        {log.workoutCompleted ? 'Done' : 'Missed'}
                                                    </div>
                                                    <button onClick={() => handleDeleteLog(log._id)} className="p-1.5 text-muted hover:text-red-500 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {log.meals?.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                                                    {log.meals.slice(0, 3).map((m, i) => (
                                                        <div key={i} className="text-[10px] text-muted flex flex-col mb-1">
                                                            <span className="font-bold text-white/50">{m.mealName}:</span>
                                                            <span className="line-clamp-1">{m.items}</span>
                                                        </div>
                                                    ))}
                                                    {log.meals.length > 3 && <p className="text-[9px] text-indigo-400/70 italic">+{log.meals.length - 3} more meals</p>}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'metrics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Scale size={18} className="text-emerald-400" /> Record Body Metrics</h2>
                        <form onSubmit={handleMetricSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase mb-2">Date</label>
                                    <input type="date" required className="pc-input w-full" value={metricData.date} onChange={e => setMetricData({ ...metricData, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase mb-2">Weight (kg)</label>
                                    <input type="number" step="0.1" className="pc-input w-full" value={metricData.weight} onChange={e => setMetricData({ ...metricData, weight: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase mb-2">Stomach (cm)</label>
                                    <input type="number" step="0.1" className="pc-input w-full" value={metricData.stomach} onChange={e => setMetricData({ ...metricData, stomach: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-bold text-muted uppercase mb-2">Arms</label>
                                        <input type="number" step="0.1" className="pc-input w-full" value={metricData.arm} onChange={e => setMetricData({ ...metricData, arm: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-muted uppercase mb-2">Legs</label>
                                        <input type="number" step="0.1" className="pc-input w-full" value={metricData.leg} onChange={e => setMetricData({ ...metricData, leg: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500">
                                <TrendingUp size={16} className="mr-2" /> Save Statistics
                            </Button>
                        </form>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-bold text-white mb-4">Measurement History</h2>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {metrics.length === 0 ? (
                                <p className="text-sm text-muted text-center py-6">No measurements tracked yet.</p>
                            ) : (
                                [...metrics].sort((a, b) => new Date(b.date) - new Date(a.date)).map(m => (
                                    <div key={m._id} className="p-4 bg-surface-2 rounded-xl border border-white/5 flex items-center justify-between group h-20">
                                        <div>
                                            <p className="font-bold text-sm text-white">{new Date(m.date).toLocaleDateString()}</p>
                                            <div className="flex gap-3 text-[10px] text-muted font-bold uppercase mt-1">
                                                {m.weight && <span>W: {m.weight}kg</span>}
                                                {m.stomach && <span>S: {m.stomach}cm</span>}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteMetric(m._id)} className="p-2 text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
