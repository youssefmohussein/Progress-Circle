import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../api/tasksAPI';
import { habitsAPI } from '../api/habitsAPI';
import { goalsAPI } from '../api/goalsAPI';
import { leaderboardAPI } from '../api/leaderboardAPI';
import { coursesAPI } from '../api/coursesAPI';
import { assignmentsAPI } from '../api/assignmentsAPI';
import { examsAPI } from '../api/examsAPI';
import { workoutsAPI } from '../api/workoutsAPI';
import { learningAPI } from '../api/learningAPI';
import { scheduleAPI } from '../api/scheduleAPI';
import { useAuth } from './AuthContext';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
    const { isAuthenticated } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [exams, setExams] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [learningSessions, setLearningSessions] = useState([]);
    const [scheduleBlocks, setScheduleBlocks] = useState([]);

    // Fetch all data when user is authenticated
    const fetchAll = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const [
                tasksRes, habitsRes, goalsRes, leaderboardRes,
                coursesRes, assignmentsRes, examsRes, workoutsRes, learningRes, scheduleRes
            ] = await Promise.all([
                tasksAPI.getAll(),
                habitsAPI.getAll(),
                goalsAPI.getAll(),
                leaderboardAPI.get(),
                coursesAPI.getAll(),
                assignmentsAPI.getAll(),
                examsAPI.getAll(),
                workoutsAPI.getAll(),
                learningAPI.getAll(),
                scheduleAPI.getAll(),
            ]);
            setTasks(tasksRes.data.data.map(normalizeId));
            setHabits(habitsRes.data.data.map(normalizeId));
            setGoals(goalsRes.data.data.map(normalizeId));
            setLeaderboard(leaderboardRes.data.data);

            setCourses(coursesRes.data.data.map(normalizeId));
            setAssignments(assignmentsRes.data.data.map(normalizeId));
            setExams(examsRes.data.data.map(normalizeId));
            setWorkouts(workoutsRes.data.data.map(normalizeId));
            setLearningSessions(learningRes.data.data.map(normalizeId));
            setScheduleBlocks(scheduleRes.data.data.map(normalizeId));
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

    // ─── Phase 2: Academics ──────────────────────────────────────────────────
    const addCourse = async (data) => {
        const res = await coursesAPI.create(data);
        setCourses((prev) => [normalizeId(res.data.data), ...prev]);
    };
    const updateCourse = async (id, data) => {
        const res = await coursesAPI.update(id, data);
        setCourses((prev) => prev.map((c) => (c.id === id ? normalizeId(res.data.data) : c)));
    };
    const deleteCourse = async (id) => {
        await coursesAPI.delete(id);
        setCourses((prev) => prev.filter((c) => c.id !== id));
    };

    const addAssignment = async (data) => {
        const res = await assignmentsAPI.create(data);
        setAssignments((prev) => [normalizeId(res.data.data), ...prev]);
    };
    const updateAssignment = async (id, data) => {
        const res = await assignmentsAPI.update(id, data);
        setAssignments((prev) => prev.map((a) => (a.id === id ? normalizeId(res.data.data) : a)));
    };
    const deleteAssignment = async (id) => {
        await assignmentsAPI.delete(id);
        setAssignments((prev) => prev.filter((a) => a.id !== id));
    };

    const addExam = async (data) => {
        const res = await examsAPI.create(data);
        setExams((prev) => [normalizeId(res.data.data), ...prev]);
    };
    const updateExam = async (id, data) => {
        const res = await examsAPI.update(id, data);
        setExams((prev) => prev.map((e) => (e.id === id ? normalizeId(res.data.data) : e)));
    };
    const deleteExam = async (id) => {
        await examsAPI.delete(id);
        setExams((prev) => prev.filter((e) => e.id !== id));
    };

    // ─── Phase 2: Fitness, Learning, Schedule ─────────────────────────────────
    const addWorkout = async (data) => {
        const res = await workoutsAPI.create(data);
        setWorkouts((prev) => [normalizeId(res.data.data), ...prev]);
    };
    const deleteWorkout = async (id) => {
        await workoutsAPI.delete(id);
        setWorkouts((prev) => prev.filter((w) => w.id !== id));
    };

    const addLearningSession = async (data) => {
        const res = await learningAPI.create(data);
        setLearningSessions((prev) => [normalizeId(res.data.data), ...prev]);
    };
    const deleteLearningSession = async (id) => {
        await learningAPI.delete(id);
        setLearningSessions((prev) => prev.filter((s) => s.id !== id));
    };

    const addScheduleBlock = async (data) => {
        const res = await scheduleAPI.create(data);
        setScheduleBlocks((prev) => [normalizeId(res.data.data), ...prev]);
    };
    const updateScheduleBlock = async (id, data) => {
        const res = await scheduleAPI.update(id, data);
        setScheduleBlocks((prev) => prev.map((s) => (s.id === id ? normalizeId(res.data.data) : s)));
    };
    const deleteScheduleBlock = async (id) => {
        await scheduleAPI.delete(id);
        setScheduleBlocks((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <DataContext.Provider
            value={{
                tasks, habits, goals, leaderboard,
                courses, assignments, exams, workouts, learningSessions, scheduleBlocks,
                addTask, updateTask, deleteTask,
                addHabit, toggleHabitToday, deleteHabit,
                addGoal, updateGoal, deleteGoal,
                addCourse, updateCourse, deleteCourse,
                addAssignment, updateAssignment, deleteAssignment,
                addExam, updateExam, deleteExam,
                addWorkout, deleteWorkout,
                addLearningSession, deleteLearningSession,
                addScheduleBlock, updateScheduleBlock, deleteScheduleBlock,
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