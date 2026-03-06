import { motion } from 'framer-motion';
import { Target, Trophy, Flame, CheckCircle2, Repeat, Clock, HelpCircle, Star, Shield } from 'lucide-react';
import { Card } from '../components/Card';

export function Info() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-32">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                    <HelpCircle size={28} />
                </div>
                <div>
                    <h1 className="font-extrabold pc-gradient-text tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.6rem, 6vw, 2.25rem)' }}>How It Works</h1>
                    <p className="text-xs text-muted font-medium mt-1 uppercase tracking-[0.2em]">Guide & Point System</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ── What is Progress Circle? ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
                    <Card className="h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <Star className="text-yellow-500" size={24} />
                            <h2 className="text-xl font-bold">What is Progress Circle?</h2>
                        </div>
                        <p className="text-sm text-pc-muted leading-relaxed mb-4">
                            Progress Circle is a comprehensive productivity suite designed to help you organize your life, track your time, build lasting habits, and conquer your goals through gamification.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <strong className="text-sm text-white block">Tasks (Nodes)</strong>
                                    <span className="text-xs text-pc-muted">Break down huge projects into small, manageable checklists.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Repeat className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <strong className="text-sm text-white block">Habit Loops</strong>
                                    <span className="text-xs text-pc-muted">Track daily positive behaviors to reprogram your routines.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Target className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <strong className="text-sm text-white block">Strategic Goals</strong>
                                    <span className="text-xs text-pc-muted">Set exact deadlines and tie tasks to your longest-term visions.</span>
                                </div>
                            </li>
                        </ul>
                    </Card>
                </motion.div>

                {/* ── Points & Gamification ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                    <Card className="h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <Trophy className="text-sky-400" size={24} />
                            <h2 className="text-xl font-bold">How Points Work</h2>
                        </div>
                        <p className="text-sm text-pc-muted leading-relaxed mb-4 relative z-10">
                            The Leaderboard ranks users by their total Focus Points. You earn points automatically by completing actions in the app.
                        </p>

                        <div className="space-y-2 relative z-10">
                            {[
                                { action: "Completing a sub-task", pts: "+10 pts" },
                                { action: "Completing a big task", pts: "+10 pts" },
                                { action: "Logging a Habit", pts: "+15 pts" },
                                { action: "Achieving a Goal", pts: "+50 pts" },
                                { action: "Tracking 1 hour of Focus", pts: "+10 pts" },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-sm font-medium">{item.action}</span>
                                    <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{item.pts}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* ── Striking & Consistency ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2">
                    <Card>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="p-4 bg-orange-500/10 rounded-full shrink-0">
                                <Flame className="text-orange-500" size={40} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2">The Streak System 🔥</h2>
                                <p className="text-sm text-pc-muted leading-relaxed">
                                    Your streak represents consecutive days of <strong>meaningful activity</strong>. To extend your streak, you must do at least one of the following every day:
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-400" /> Complete 1 Task</span>
                                    <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Repeat size={12} className="text-indigo-400" /> Log 1 Habit</span>
                                    <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Target size={12} className="text-rose-400" /> Complete 1 Goal</span>
                                    <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Clock size={12} className="text-sky-400" /> Track Focus Time</span>
                                </div>
                                <p className="text-xs text-rose-400/80 mt-3 font-medium bg-rose-500/5 p-2 rounded inline-block">
                                    Miss a day, and your streak resets to 0. Stay consistent!
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
