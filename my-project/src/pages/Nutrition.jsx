import { useState, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';

import { motion } from 'framer-motion';
import { 
    Salad, Plus, Droplets, Trash2, Clock, 
    Flame, Zap, Target, Coffee, Utensils,
    ChevronLeft, ChevronRight, Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/client';
import { Confetti } from '../components/Confetti';
import { useTheme } from '../context/ThemeContext';

export function Nutrition() {
    const { dark } = useTheme();
    useSEO('Fuel & Nutrition Tracker', 'Log daily meals, track macros, and monitor hydration with the ProgressCircle nutrition engine.');
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [nutritionData, setNutritionData] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiVariant, setConfettiVariant] = useState('rain');
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [newMeal, setNewMeal] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    });

    const fetchNutrition = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/nutrition/${selectedDate}`);
            setNutritionData(res.data.data);
        } catch (error) {
            toast.error('Failed to sync neural fuel logs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNutrition();
    }, [selectedDate]);

    const navigateDate = (days) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    const handleAddMeal = async (e) => {
        e.preventDefault();
        try {
            const mealToSubmit = {
                ...newMeal,
                calories: Number(newMeal.calories) || 0,
                protein: Number(newMeal.protein) || 0,
                carbs: Number(newMeal.carbs) || 0,
                fats: Number(newMeal.fats) || 0
            };
            const res = await api.post(`/nutrition/${selectedDate}/meal`, mealToSubmit);
            setNutritionData(res.data.data);
            setConfettiVariant('rain');
            setShowConfetti(true);
            setNewMeal({ name: '', calories: '', protein: '', carbs: '', fats: '', time: '12:00' });
            setShowAddMeal(false);
            toast.success('Fuel node integrated.');
        } catch (error) {
            toast.error('Failed to add meal.');
        }
    };

    const handleWaterUpdate = async (amount) => {
        try {
            const res = await api.put(`/nutrition/${selectedDate}/water`, { amount });
            setNutritionData(res.data.data);
            setConfettiVariant('rain');
            setShowConfetti(true);
            toast.success(`+${amount}ml Hydration synced.`);
        } catch (error) {
            toast.error('Water sync failed.');
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            const res = await api.delete(`/nutrition/${selectedDate}/meal/${mealId}`);
            setNutritionData(res.data.data);
            toast.success('Meal node removed from archive.');
        } catch (error) {
            toast.error('Delete failed.');
        }
    };

    if (loading) return <div className="p-8 text-center text-muted">Scanning biological fuel signatures...</div>;

    const totals = nutritionData?.meals.reduce((acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fats: acc.fats + m.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 }) || { calories: 0, protein: 0, carbs: 0, fats: 0 };

    const target = nutritionData?.dailyTargetCalories || 2000;
    const calProgress = Math.min((totals.calories / target) * 100, 100);

    return (
        <div className="space-y-6 max-w-4xl pb-10">
            {/* Header section with Stats Card */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="pc-card relative overflow-hidden"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Salad size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Fuel & Nutrition</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1 text-xs font-bold text-muted bg-surface2 px-2 py-1 rounded-lg border border-border/5">
                                    <CalendarIcon size={12} className="text-indigo-400" />
                                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </div>
                                {!isToday && (
                                    <button 
                                        onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                                        className="text-[10px] uppercase font-black text-indigo-500 hover:text-indigo-400 tracking-widest"
                                    >
                                        Return to Today
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-surface2 p-1.5 rounded-2xl border border-border/10">
                        <button 
                            onClick={() => navigateDate(-1)}
                            className="p-2.5 rounded-xl hover:bg-surface transition-all text-muted"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="px-4 py-1.5 text-xs font-black uppercase tracking-tighter text-text">
                            Time Drift
                        </div>
                        <button 
                            onClick={() => navigateDate(1)}
                            className="p-2.5 rounded-xl hover:bg-surface transition-all text-muted"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <button 
                        onClick={() => setShowAddMeal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Plus size={18} /> Add Neural Fuel
                    </button>
                </div>

                {/* Macro Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 rounded-2xl bg-surface2 border border-border/10">
                        <div className="flex items-center gap-2 mb-2 text-indigo-400">
                            <Flame size={16} /> <span className="text-[10px] font-bold uppercase tracking-wider">Calories</span>
                        </div>
                        <div className="text-xl font-black">{totals.calories} <span className="text-[10px] text-muted font-normal">/ {target} kcal</span></div>
                        <div className="h-1.5 bg-border/20 rounded-full mt-2 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${calProgress}%` }} className="h-full bg-indigo-500" />
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface2 border border-border/10">
                        <div className="flex items-center gap-2 mb-2 text-rose-400">
                            <Zap size={16} /> <span className="text-[10px] font-bold uppercase tracking-wider">Protein</span>
                        </div>
                        <div className="text-xl font-black">{totals.protein}g</div>
                        <p className="text-[10px] text-muted">Muscle Synthesis Factor</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface2 border border-border/10">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <Target size={16} /> <span className="text-[10px] font-bold uppercase tracking-wider">Carbs</span>
                        </div>
                        <div className="text-xl font-black">{totals.carbs}g</div>
                        <p className="text-[10px] text-muted">Cognitive Fuel</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface2 border border-border/10">
                        <div className="flex items-center gap-2 mb-2 text-amber-400">
                            <Droplets size={16} /> <span className="text-[10px] font-bold uppercase tracking-wider">Hydration</span>
                        </div>
                        <div className="text-xl font-black">{nutritionData?.waterIntake || 0} <span className="text-[10px] text-muted font-normal">ml</span></div>
                        <p className="text-[10px] text-muted">Neural Fluid Level</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Meal History */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold flex items-center gap-2"><Utensils size={18} className="text-indigo-400" /> Meal Archive</h3>
                        <span className="text-xs text-muted">{nutritionData?.meals.length} entries detected</span>
                    </div>

                    {nutritionData?.meals.length === 0 ? (
                        <div className="pc-card py-12 text-center text-muted flex flex-col items-center gap-3">
                            <Salad size={40} className="opacity-20 translate-y-2" />
                            <p>No biological fuel nodes logged today.</p>
                            <button onClick={() => setShowAddMeal(true)} className="text-xs text-primary font-bold underline">Initialize Log</button>
                        </div>
                    ) : (
                        nutritionData?.meals.map((meal) => (
                            <motion.div 
                                key={meal._id}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                className="pc-card p-4 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center text-indigo-400 border border-border/10">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm tracking-tight">{meal.name}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-[10px] font-medium text-muted">{meal.time}</span>
                                            <span className="text-[10px] font-black text-indigo-400">{meal.calories} KCAL</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden sm:flex items-center gap-4 text-[10px] font-bold uppercase text-muted">
                                        <div>P: <span className="text-rose-400">{meal.protein}g</span></div>
                                        <div>C: <span className="text-emerald-400">{meal.carbs}g</span></div>
                                        <div>F: <span className="text-amber-400">{meal.fats}g</span></div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteMeal(meal._id)}
                                        className="p-2 text-muted hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    {/* Water Tracker Card */}
                    <div className="pc-card p-5 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm flex items-center gap-2 text-indigo-400"><Droplets size={16} /> Hydration Sync</h3>
                            <span className="text-xs font-black text-indigo-500">{((nutritionData?.waterIntake || 0) / 2000 * 100).toFixed(0)}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleWaterUpdate(250)} className="p-3 rounded-xl bg-surface2 border border-border/10 hover:border-indigo-500/50 transition-all text-xs font-bold text-center">
                                +250ml <br/> <span className="text-[9px] text-muted font-normal">Glass</span>
                            </button>
                            <button onClick={() => handleWaterUpdate(500)} className="p-3 rounded-xl bg-surface2 border border-border/10 hover:border-indigo-500/50 transition-all text-xs font-bold text-center">
                                +500ml <br/> <span className="text-[9px] text-muted font-normal">Bottle</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Insight Card */}
                    <div className="pc-card p-5 bg-surface2">
                        <h3 className="font-bold text-sm mb-3 text-muted flex items-center gap-2"><Coffee size={16} /> Dietary Analysis</h3>
                        <p className="text-[11px] leading-relaxed text-muted line-clamp-3">
                            Neural signal optimization requires balanced macro distribution. Current focus fuel status is 
                            {totals.carbs > totals.protein * 2 ? ' biased towards fast carbs.' : ' optimally balanced.'}
                        </p>
                        <button className="mt-4 text-[10px] w-full py-2 bg-border/20 rounded-lg hover:bg-border/30 transition-all font-bold tracking-widest uppercase">
                            View Deep Insights
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Adding Meal */}
            {showAddMeal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface pc-card p-6 w-full max-w-md shadow-2xl border-indigo-500/30"
                    >
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            Add Neural Fuel Node
                        </h3>
                        <form onSubmit={handleAddMeal} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-widest block mb-1">Meal Name</label>
                                <input 
                                    autoFocus
                                    required
                                    className="w-full bg-surface2 border border-border/10 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
                                    placeholder="e.g. Pre-Focus Protein Bowl"
                                    value={newMeal.name}
                                    onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase tracking-widest block mb-1">Calories</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-surface2 border border-border/10 p-3 rounded-xl text-sm outline-none"
                                        placeholder="0"
                                        value={newMeal.calories}
                                        onChange={e => setNewMeal({...newMeal, calories: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase tracking-widest block mb-1">Time</label>
                                    <input 
                                        type="time"
                                        className="w-full bg-surface2 border border-border/10 p-3 rounded-xl text-sm outline-none"
                                        value={newMeal.time}
                                        onChange={e => setNewMeal({...newMeal, time: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-rose-400/70 uppercase tracking-widest block mb-1">PROT (g)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-surface2 border border-border/10 p-2 rounded-xl text-sm outline-none text-rose-400"
                                        placeholder="0"
                                        value={newMeal.protein}
                                        onChange={e => setNewMeal({...newMeal, protein: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-emerald-400/70 uppercase tracking-widest block mb-1">CARBS (g)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-surface2 border border-border/10 p-2 rounded-xl text-sm outline-none text-emerald-400"
                                        placeholder="0"
                                        value={newMeal.carbs}
                                        onChange={e => setNewMeal({...newMeal, carbs: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-amber-400/70 uppercase tracking-widest block mb-1">FATS (g)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-surface2 border border-border/10 p-2 rounded-xl text-sm outline-none text-amber-400"
                                        placeholder="0"
                                        value={newMeal.fats}
                                        onChange={e => setNewMeal({...newMeal, fats: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button 
                                    type="button"
                                    onClick={() => setShowAddMeal(false)}
                                    className="flex-1 p-3 bg-border/20 rounded-xl font-bold text-sm hover:bg-border/30 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] p-3 bg-indigo-500 rounded-xl font-bold text-sm text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Integrate Node
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <Confetti active={showConfetti} theme="nutrition" variant={confettiVariant} onComplete={() => setShowConfetti(false)} />
        </div>
    );
}
