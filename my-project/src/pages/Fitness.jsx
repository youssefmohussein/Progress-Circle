import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Dumbbell, Utensils, Calendar, Plus, Save } from 'lucide-react';
import api from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { toast } from 'sonner';

export function Fitness() {
    const [cycle, setCycle] = useState(null);
    const [loading, setLoading] = useState(true);

    // Setup state
    const [showSetup, setShowSetup] = useState(false);
    const [setupData, setSetupData] = useState({ cycleType: 'Push/Pull/Legs', daysCount: 7 });

    // Log state
    const [logData, setLogData] = useState({
        date: new Date().toISOString().split('T')[0],
        isRestDay: false,
        workoutCompleted: false,
        foodEaten: '',
        notes: ''
    });

    const fetchCycle = async () => {
        try {
            const res = await api.get('/fitness/cycle');
            setCycle(res.data.data); // will be null if no active cycle
        } catch (error) {
            toast.error('Failed to load fitness cycle');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCycle();
    }, []);

    const handleSetupSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fitness/cycle', setupData);
            toast.success('Fitness cycle setup complete!');
            setShowSetup(false);
            fetchCycle();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to setup cycle');
        }
    };

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fitness/log', logData);
            toast.success('Daily fitness logged successfully!');
            fetchCycle();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to log daily fitness');
        }
    };

    if (loading) return <LoadingSpinner />;

    if (!cycle || showSetup) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <Activity size={48} className="mx-auto text-indigo-500 mb-4" />
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Fitness Tracking Setup</h1>
                    <p className="text-muted mt-2">Create a cycle to start tracking your workouts and nutrition.</p>
                </div>

                <Card>
                    <form onSubmit={handleSetupSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Cycle Strategy</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Push/Pull/Legs, Upper/Lower, Customized"
                                className="pc-input w-full"
                                value={setupData.cycleType}
                                onChange={e => setSetupData({ ...setupData, cycleType: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Days in Cycle</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="pc-input w-full"
                                value={setupData.daysCount}
                                onChange={e => setSetupData({ ...setupData, daysCount: Number(e.target.value) })}
                            />
                        </div>
                        <Button type="submit" className="w-full">Start Cycle</Button>
                        {cycle && (
                            <Button type="button" variant="secondary" className="w-full mt-2" onClick={() => setShowSetup(false)}>Cancel</Button>
                        )}
                    </form>
                </Card>
            </div>
        );
    }

    // Identify log for selected date
    const selectedDateStr = new Date(logData.date).setHours(0, 0, 0, 0);
    const existingLog = cycle.logs.find(l => new Date(l.date).setHours(0, 0, 0, 0) === selectedDateStr);

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>Fitness Tracking</h1>
                    <p className="text-sm text-muted">Cycle: {cycle.cycleType} ({cycle.daysCount} days)</p>
                </div>
                <Button variant="secondary" onClick={() => setShowSetup(true)}>
                    Edit Cycle
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>Log Daily Fitness</h2>
                    <form onSubmit={handleLogSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="pc-input w-full"
                                value={logData.date}
                                onChange={e => setLogData({ ...logData, date: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isRestDay"
                                checked={logData.isRestDay}
                                onChange={e => setLogData({ ...logData, isRestDay: e.target.checked })}
                                className="rounded pc-checkbox"
                            />
                            <label htmlFor="isRestDay" className="text-sm font-medium">Is this a Rest Day?</label>
                        </div>

                        {!logData.isRestDay && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="workoutCompleted"
                                    checked={logData.workoutCompleted}
                                    onChange={e => setLogData({ ...logData, workoutCompleted: e.target.checked })}
                                    className="rounded pc-checkbox"
                                />
                                <label htmlFor="workoutCompleted" className="text-sm font-medium">Workout Completed?</label>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Food Eaten</label>
                            <textarea
                                placeholder="e.g. Chicken, rice, 3 eggs..."
                                className="pc-input w-full min-h-[80px]"
                                value={logData.foodEaten}
                                onChange={e => setLogData({ ...logData, foodEaten: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <input
                                type="text"
                                placeholder="Felt great, pushed 20lbs more..."
                                className="pc-input w-full"
                                value={logData.notes}
                                onChange={e => setLogData({ ...logData, notes: e.target.value })}
                            />
                        </div>

                        {existingLog && (
                            <p className="text-xs text-orange-500 bg-orange-500/10 p-2 rounded">
                                A log already exists for this date. Saving will overwrite it.
                            </p>
                        )}

                        <Button type="submit" className="w-full">
                            <Save size={16} className="mr-2" /> Save Log
                        </Button>
                    </form>
                </Card>

                <Card>
                    <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>Recent History</h2>
                    <div className="space-y-3">
                        {cycle.logs.length === 0 ? (
                            <p className="text-sm text-muted text-center py-6">No history available yet.</p>
                        ) : (
                            [...cycle.logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(log => (
                                <div key={log._id} className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                                            {new Date(log.date).toLocaleDateString()}
                                        </p>
                                        <div className={`text-xs px-2 py-1 rounded-md font-medium ${log.isRestDay ? 'bg-indigo-500/20 text-indigo-400' : (log.workoutCompleted ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500')}`}>
                                            {log.isRestDay ? 'Rest Day' : (log.workoutCompleted ? 'Completed' : 'Missed')}
                                        </div>
                                    </div>
                                    {log.foodEaten && (
                                        <div className="flex gap-2 items-start mt-1 text-sm text-muted">
                                            <Utensils size={14} className="mt-0.5 shrink-0" />
                                            <span className="line-clamp-2">{log.foodEaten}</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
