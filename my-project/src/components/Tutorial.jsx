import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Joyride, { STATUS } from 'react-joyride';
import { Sparkles, X, Target } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export function Tutorial() {
    const { user } = useAuth();
    const location = useLocation();
    const [runTour, setRunTour] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const tutorialStatus = localStorage.getItem(`tutorialDecided_${user?._id || 'guest'}`);
        if (!tutorialStatus) {
            const timer = setTimeout(() => setShowPrompt(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [user]);

    useEffect(() => {
        const handleStart = () => {
            setShowPrompt(false);
            setRunTour(true);
        };
        window.addEventListener('start-tutorial', handleStart);
        return () => window.removeEventListener('start-tutorial', handleStart);
    }, []);

    const handleAccept = () => {
        setShowPrompt(false);
        setTimeout(() => setRunTour(true), 300);
        localStorage.setItem(`tutorialDecided_${user?._id || 'guest'}`, 'yes');
    };

    const handleDecline = () => {
        setShowPrompt(false);
        localStorage.setItem(`tutorialDecided_${user?._id || 'guest'}`, 'no');
    };

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            setRunTour(false);
        }
    };

    const baseGlobalSteps = [
        {
            content: (
                <div>
                    <h3 className="text-xl font-black mb-3 pc-gradient-text" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Welcome to ProgressCircle</h3>
                    <p className="text-sm font-medium text-gray-300 mb-2">Let's take a quick tour of your new productivity dashboard.</p>
                    <p className="text-xs text-indigo-400 font-bold tracking-wider uppercase">Your Dashboard</p>
                </div>
            ),
            placement: 'center',
            target: 'body',
            disableScrolling: true,
        },
        {
            target: '#tour-nav-home',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">The Dashboard</h3>
                    <p className="text-sm font-medium text-gray-300">This is where your productivity starts. Track your tasks and focus time in one place.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        },
        {
            target: '#tour-nav-tasks',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Task Manager</h3>
                    <p className="text-sm font-medium text-gray-300">Break massive goals into small tasks, set priority levels, and track your progress.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        },
        {
            target: '#tour-nav-planner',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Weekly Planner</h3>
                    <p className="text-sm font-medium text-gray-300">Visualize your week ahead. Plan your tasks and schedule deep-work sessions.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        }
    ];

    if (user?.habitsEnabled !== false) {
        baseGlobalSteps.push({
            target: '#tour-nav-habits',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Habit Tracker</h3>
                    <p className="text-sm font-medium text-gray-300">Build better routines. Track daily completion to build long-term consistency.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        });
    }

    if (user?.savingsEnabled) {
        baseGlobalSteps.push({
            target: '#tour-nav-savings',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Savings Tracker</h3>
                    <p className="text-sm font-medium text-gray-300">Track your income and expenses. Achieve your savings goals faster.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        });
    }

    if (user?.fitnessEnabled) {
        baseGlobalSteps.push({
            target: '#tour-nav-fitness',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Fitness Tracking</h3>
                    <p className="text-sm font-medium text-gray-300">Log your workouts, monitor your intensity, and track your physical progress.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        });
    }

    if (user?.nutritionEnabled) {
        baseGlobalSteps.push({
            target: '#tour-nav-nutrition',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Dietary Fuel</h3>
                    <p className="text-sm font-medium text-gray-300">Monitor caloric intake and macronutrient profiles to ensure your body runs at optimal efficiency.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        });
    }

    if (user?.synergyEnabled) {
        baseGlobalSteps.push({
            target: '#tour-nav-synergy',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Squad Rooms</h3>
                    <p className="text-sm font-medium text-gray-300">Work with friends. Stay accountable. Join focus rooms to stay productive together.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        });
        baseGlobalSteps.push({
            target: '#tour-nav-social',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Friends</h3>
                    <p className="text-sm font-medium text-gray-300">Connect with your friends, send requests, and track combined productivity.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        });
    }

    baseGlobalSteps.push({
        target: '#tour-nav-leaderboard',
        content: (
            <div>
                <h3 className="text-lg font-black mb-2 text-white">Global Leaderboard</h3>
                <p className="text-sm font-medium text-gray-300">See where you stand against users worldwide based on target focus time and tasks.</p>
            </div>
        ),
        placement: 'right',
        disableScrolling: true,
    });

    baseGlobalSteps.push({
        target: '#tour-gamification',
        content: (
            <div>
                <h3 className="text-lg font-black mb-2 text-white">World-Class Gamification</h3>
                <p className="text-sm font-medium text-gray-300">Consistency pays off. Earn premium currency from tasks, level up, buy avatars, and grow your Virtual Focus Farm.</p>
            </div>
        ),
        placement: 'right',
        disableScrolling: true,
    });

    baseGlobalSteps.push({
        target: '#tour-quick-focus',
        content: (
            <div>
                <h3 className="text-lg font-black mb-2 text-white">Focus Mode</h3>
                <p className="text-sm font-medium text-gray-300">Need zero distractions? Trigger Focus Mode to shut out the world and concentrate on your work.</p>
            </div>
        ),
        placement: 'bottom-end',
        disableScrolling: true,
    });

    baseGlobalSteps.push({
        target: '#tour-profile',
        content: (
            <div>
                <h3 className="text-lg font-black mb-2 text-white">Your Profile</h3>
                <p className="text-sm font-medium text-gray-300">Toggle modules like Fitness and Savings, check your points, and manage your account settings.</p>
            </div>
        ),
        placement: 'right',
        disableScrolling: true,
    });

    const globalSteps = baseGlobalSteps;

    const homeSteps = [
        {
            target: '#tour-progress-brain',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Daily Progress Ring</h3>
                    <p className="text-sm font-medium text-gray-300">A live readout of how close you are to finishing your tasks and focus goals for the day.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        },
        {
            target: '#tour-smart-suggestion',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Smart Assistant</h3>
                    <p className="text-sm font-medium text-gray-300">The assistant checks your schedule and pending tasks to suggest the best times for deep work.</p>
                </div>
            ),
            placement: 'bottom',
            disableScrolling: true,
        },
        {
            target: '#tour-next-critical',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Deadline Warnings</h3>
                    <p className="text-sm font-medium text-gray-300">Critical deadlines within 24 hours appear here so you never miss an important task.</p>
                </div>
            ),
            placement: 'bottom',
            disableScrolling: true,
        },
        {
            target: '#tour-activity-timeline',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Activity Timeline</h3>
                    <p className="text-sm font-medium text-gray-300">A history of every task you've completed and focus session you've finished today.</p>
                </div>
            ),
            placement: 'right',
            disableScrolling: true,
        },
        {
            target: '#tour-weekly-insights',
            content: (
                <div>
                    <h3 className="text-lg font-black mb-2 text-white">Weekly Performance</h3>
                    <p className="text-sm font-medium text-gray-300">Track your progress over the week. Identify your most productive days and stay consistent.</p>
                </div>
            ),
            placement: 'top',
            disableScrolling: true,
        }
    ];

    const steps = location.pathname === '/' ? [...globalSteps, ...homeSteps] : globalSteps;

    return (
        <>
            <AnimatePresence>
                {showPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, type: 'spring', damping: 25 }}
                            className="bg-[#1e1e2e] border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-md relative overflow-hidden"
                        >
                            <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
                            
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-glow">
                                    <Sparkles className="text-indigo-400 w-8 h-8 animate-pulse" />
                                </div>
                                
                                <h2 className="text-2xl font-black mb-3 text-white page-title" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                    System Initialized
                                </h2>
                                <p className="text-sm font-medium text-gray-400 mb-8 max-w-[280px]">
                                    Would you like a quick professional tour of your new dashboard features?
                                </p>
                                
                                <div className="flex flex-col sm:flex-row w-full gap-3">
                                    <Button 
                                        variant="ghost" 
                                        onClick={handleDecline}
                                        className="flex-1 h-12 border border-white/10 font-bold uppercase tracking-wider text-xs hover:bg-white/5 bg-transparent"
                                    >
                                        Skip Tour
                                    </Button>
                                    <Button 
                                        onClick={handleAccept}
                                        className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-wider text-xs shadow-lg shadow-indigo-500/20 text-white border-none"
                                    >
                                        <Target size={16} className="mr-2" /> Start Tour
                                    </Button>
                                </div>
                            </div>
                            
                            <button onClick={handleDecline} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Joyride
                steps={steps}
                run={runTour}
                continuous
                showSkipButton
                showProgress
                hideCloseButton
                callback={handleJoyrideCallback}
                floaterProps={{
                    disableAnimation: true,
                }}
                styles={{
                    options: {
                        arrowColor: '#2a2a3e',
                        backgroundColor: '#2a2a3e',
                        primaryColor: '#6366f1',
                        textColor: '#ffffff',
                        overlayColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1000,
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        overflow: 'hidden',
                        padding: '8px'
                    },
                    buttonNext: {
                        borderRadius: '8px',
                        padding: '10px 18px',
                        fontWeight: '900',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
                    },
                    buttonBack: {
                        color: '#9ca3af',
                        marginRight: '12px',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    },
                    buttonSkip: {
                        color: '#9ca3af',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    },
                }}
            />
        </>
    );
}
