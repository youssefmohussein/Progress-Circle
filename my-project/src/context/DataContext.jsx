import { createContext, useContext, useState } from 'react';

const DataContext = createContext(undefined);

const mockTasks = [
    {
        id: '1',
        userId: '1',
        title: 'Complete React Tutorial',
        description: 'Finish the advanced hooks section',
        priority: 'high',
        status: 'in_progress',
        deadline: '2024-03-10',
        createdAt: '2024-03-05',
    },
    {
        id: '2',
        userId: '1',
        title: 'Gym Session',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-03-05',
    },
    {
        id: '3',
        userId: '1',
        title: 'Read Chapter 5',
        description: 'Database Design Principles',
        priority: 'low',
        status: 'pending',
        deadline: '2024-03-08',
        createdAt: '2024-03-04',
    },
];

const mockHabits = [
    {
        id: '1',
        userId: '1',
        name: 'Daily Coding',
        description: 'Code for at least 1 hour',
        streak: 12,
        completedDates: ['2024-03-05', '2024-03-04', '2024-03-03', '2024-03-02', '2024-03-01'],
        createdAt: '2024-02-20',
    },
    {
        id: '2',
        userId: '1',
        name: 'Exercise',
        description: 'Workout or run',
        streak: 8,
        completedDates: ['2024-03-05', '2024-03-04', '2024-03-03'],
        createdAt: '2024-02-25',
    },
    {
        id: '3',
        userId: '1',
        name: 'Reading',
        description: 'Read 30 minutes',
        streak: 5,
        completedDates: ['2024-03-04', '2024-03-03', '2024-03-02'],
        createdAt: '2024-02-28',
    },
];

const mockGoals = [
    {
        id: '1',
        userId: '1',
        title: 'Learn TypeScript',
        description: 'Master TypeScript fundamentals and advanced patterns',
        progress: 65,
        targetDate: '2024-04-01',
        status: 'active',
        createdAt: '2024-02-01',
    },
    {
        id: '2',
        userId: '1',
        title: 'Build Portfolio Website',
        progress: 40,
        targetDate: '2024-03-20',
        status: 'active',
        createdAt: '2024-02-15',
    },
    {
        id: '3',
        userId: '1',
        title: 'Complete Online Course',
        description: 'Full Stack Development Bootcamp',
        progress: 80,
        status: 'active',
        createdAt: '2024-01-15',
    },
];

const mockUsers = [
    {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        points: 1250,
        streak: 12,
        joinedAt: '2024-01-15',
    },
    {
        id: '2',
        name: 'Sarah Miller',
        email: 'sarah@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        points: 1180,
        streak: 15,
        joinedAt: '2024-01-10',
    },
    {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@example.com',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
        points: 980,
        streak: 8,
        joinedAt: '2024-01-20',
    },
];

export function DataProvider({ children }) {
    const [tasks, setTasks] = useState(mockTasks);
    const [habits, setHabits] = useState(mockHabits);
    const [goals, setGoals] = useState(mockGoals);
    const [leaderboard] = useState(
        mockUsers.map((user, index) => ({
            user,
            rank: index + 1,
            weeklyPoints: user.points - index * 100,
        }))
    );

    const addTask = (task) => {
        const newTask = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setTasks([newTask, ...tasks]);
    };

    const updateTask = (id, updates) => {
        setTasks(tasks.map(task => (task.id === id ? { ...task, ...updates } : task)));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const addHabit = (habit) => {
        const newHabit = {
            ...habit,
            id: Date.now().toString(),
            streak: 0,
            completedDates: [],
            createdAt: new Date().toISOString(),
        };
        setHabits([newHabit, ...habits]);
    };

    const toggleHabitToday = (id) => {
        const today = new Date().toISOString().split('T')[0];
        setHabits(
            habits.map(habit => {
                if (habit.id === id) {
                    const isCompletedToday = habit.completedDates.includes(today);
                    const completedDates = isCompletedToday
                        ? habit.completedDates.filter(date => date !== today)
                        : [...habit.completedDates, today];
                    return {
                        ...habit,
                        completedDates,
                        streak: isCompletedToday ? Math.max(0, habit.streak - 1) : habit.streak + 1,
                    };
                }
                return habit;
            })
        );
    };

    const addGoal = (goal) => {
        const newGoal = {
            ...goal,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setGoals([newGoal, ...goals]);
    };

    const updateGoal = (id, updates) => {
        setGoals(goals.map(goal => (goal.id === id ? { ...goal, ...updates } : goal)));
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
                addGoal,
                updateGoal,
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