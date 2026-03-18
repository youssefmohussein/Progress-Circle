import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { tasksAPI } from '../api/tasksAPI';
import { habitsAPI } from '../api/habitsAPI';
import { goalsAPI } from '../api/goalsAPI';
import { leaderboardAPI } from '../api/leaderboardAPI';
import { categoriesAPI } from '../api/categoriesAPI';
import { sessionsAPI } from '../api/sessionsAPI';
import { calendarAPI } from '../api/calendarAPI';
import { useAuth } from './AuthContext';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
    const { isAuthenticated, refreshUser } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [calendarCache, setCalendarCache] = useState({});

    const shownAlerts = useRef(new Set());

    // Fetch all data
    const fetchAll = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const [
                tasksRes, habitsRes, leaderboardRes, categoriesRes, activeSessionRes, sessionsRes, calendarRes
            ] = await Promise.all([
                tasksAPI.getAll(),
                habitsAPI.getAll(),
                leaderboardAPI.get(),
                categoriesAPI.getAll(),
                sessionsAPI.getActive(),
                sessionsAPI.getAll(),
                calendarAPI.getEvents(dayjs().startOf('month').toISOString(), dayjs().endOf('month').toISOString()),
            ]);
            setTasks(tasksRes.data.data.map(normalizeId));
            setHabits(habitsRes.data.data.map(normalizeId));
            setLeaderboard(leaderboardRes.data.data);
            setCategories(categoriesRes.data.data.map(normalizeId));
            setActiveSession(activeSessionRes.data.data.data ? normalizeId(activeSessionRes.data.data.data) : null);
            setSessions(sessionsRes.data.data.data.map(normalizeId));
            setCalendarEvents(calendarRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error.message);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);


    const normalizeId = (item) => ({ ...item, id: item._id });

    // ─── Tasks ─────────────────────────────────────────────────────────────────
    const addTask = async (task) => {
        const res = await tasksAPI.create(task);
        setTasks((prev) => [normalizeId(res.data.data), ...prev]);
        if (refreshUser) await refreshUser();
    };

    const updateTask = async (id, updates) => {
        const res = await tasksAPI.update(id, updates);
        setTasks((prev) => prev.map((t) => (t.id === id ? normalizeId(res.data.data) : t)));
        if (updates.status && refreshUser) await refreshUser();
    };

    const deleteTask = async (id) => {
        await tasksAPI.delete(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    // ─── Habits ─────────────────────────────────────────────────────────────
    const addHabit = async (habit) => {
        const res = await habitsAPI.create(habit);
        setHabits((prev) => [normalizeId(res.data.data), ...prev]);
    };

    const toggleHabit = async (id) => {
        const res = await habitsAPI.toggle(id);
        const updated = normalizeId(res.data.data);
        setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
        return updated;
    };

    const deleteHabit = async (id) => {
        await habitsAPI.delete(id);
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    // ─── Categories ──────────────────────────────────────────────────────────
    const addCategory = async (data) => {
        const res = await categoriesAPI.create(data);
        setCategories((prev) => [normalizeId(res.data.data), ...prev]);
    };

    const updateCategory = async (id, data) => {
        const res = await categoriesAPI.update(id, data);
        setCategories((prev) => prev.map((c) => (c.id === id ? normalizeId(res.data.data) : c)));
    };

    const deleteCategory = async (id) => {
        await categoriesAPI.delete(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    // ─── Sessions ────────────────────────────────────────────────────────────
    const startSession = async (data) => {
        const res = await sessionsAPI.start(data);
        setActiveSession(normalizeId(res.data.data.data));
    };

    const endSession = async (notes, sessionId) => {
        const sid = sessionId || activeSession?.id || activeSession?._id;
        if (!sid) return;
        const res = await sessionsAPI.end(sid, { notes });
        setActiveSession(null);
        if (res.data.treeAdded) {
            toast.success(`✨ Fantastic work! You just grew a new ${res.data.treeAdded}!`, {
                description: 'Check your Focus Farm to see it.',
                duration: 5000,
            });
        }
        await fetchAll();
        if (refreshUser) await refreshUser();
    };

    const logManual = async (data) => {
        await sessionsAPI.logManual(data);
        await fetchAll();
    };

    const fetchCalendarEvents = async (start, end) => {
        const cacheKey = `${start}_${end}`;
        if (calendarCache[cacheKey]) {
            setCalendarEvents(calendarCache[cacheKey]);
            return;
        }

        try {
            const res = await calendarAPI.getEvents(start, end);
            const events = res.data.data;
            setCalendarEvents(events);
            setCalendarCache((prev) => ({ ...prev, [cacheKey]: events }));
        } catch (error) {
            console.error('Failed to fetch calendar events:', error);
        }
    };

    const addCalendarBlock = async (data) => {
        await calendarAPI.createBlock(data);
        setCalendarCache({}); // Invalidate cache
        const start = dayjs(data.startTime).startOf('month').toISOString();
        const end = dayjs(data.startTime).endOf('month').toISOString();
        await fetchCalendarEvents(start, end);
        await refreshUser();
    };

    return (
        <DataContext.Provider
            value={{
                tasks, habits, categories, leaderboard, sessions, calendarEvents,
                addTask, updateTask, deleteTask,
                addHabit, toggleHabit, deleteHabit,
                addCategory, updateCategory, deleteCategory,
                activeSession, startSession, endSession, logManual,
                addCalendarBlock, fetchCalendarEvents,
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
