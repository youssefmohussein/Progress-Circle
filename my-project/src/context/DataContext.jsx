import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../api/tasksAPI';
import { habitsAPI } from '../api/habitsAPI';
import { goalsAPI } from '../api/goalsAPI';
import { leaderboardAPI } from '../api/leaderboardAPI';
import { useAuth } from './AuthContext';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
    const { isAuthenticated } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    // Fetch all data when user is authenticated
    const fetchAll = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const [tasksRes, habitsRes, goalsRes, leaderboardRes] = await Promise.all([
                tasksAPI.getAll(),
                habitsAPI.getAll(),
                goalsAPI.getAll(),
                leaderboardAPI.get(),
            ]);
            setTasks(tasksRes.data.data.map(normalizeId));
            setHabits(habitsRes.data.data.map(normalizeId));
            setGoals(goalsRes.data.data.map(normalizeId));
            setLeaderboard(leaderboardRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error.message);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Map MongoDB _id to id for frontend consistency
    const normalizeId = (item) => ({ ...item, id: item._id });

    // ─── Tasks ─────────────────────────────────────────────────────────────────
    const addTask = async (task) => {
        const res = await tasksAPI.create(task);
        setTasks((prev) => [normalizeId(res.data.data), ...prev]);
    };

    const updateTask = async (id, updates) => {
        const res = await tasksAPI.update(id, updates);
        setTasks((prev) => prev.map((t) => (t.id === id ? normalizeId(res.data.data) : t)));
    };

    const deleteTask = async (id) => {
        await tasksAPI.delete(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    // ─── Habits ────────────────────────────────────────────────────────────────
    const addHabit = async (habit) => {
        const res = await habitsAPI.create(habit);
        setHabits((prev) => [normalizeId(res.data.data), ...prev]);
    };

    const toggleHabitToday = async (id) => {
        const res = await habitsAPI.toggle(id);
        setHabits((prev) => prev.map((h) => (h.id === id ? normalizeId(res.data.data) : h)));
    };

    const deleteHabit = async (id) => {
        await habitsAPI.delete(id);
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    // ─── Goals ─────────────────────────────────────────────────────────────────
    const addGoal = async (goal) => {
        const res = await goalsAPI.create(goal);
        setGoals((prev) => [normalizeId(res.data.data), ...prev]);
    };

    const updateGoal = async (id, updates) => {
        const res = await goalsAPI.update(id, updates);
        setGoals((prev) => prev.map((g) => (g.id === id ? normalizeId(res.data.data) : g)));
    };

    const deleteGoal = async (id) => {
        await goalsAPI.delete(id);
        setGoals((prev) => prev.filter((g) => g.id !== id));
    };

    return (
        <DataContext.Provider
            value={{
                tasks,
                habits,
                goals,
                leaderboard,
                addTask,
                updateTask,
                deleteTask,
                addHabit,
                toggleHabitToday,
                deleteHabit,
                addGoal,
                updateGoal,
                deleteGoal,
                refreshData: fetchAll,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}