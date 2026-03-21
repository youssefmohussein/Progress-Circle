import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Activity, Trophy, Target,
    ArrowRight, CheckCircle2,
    BarChart3, Layout, Smartphone,
    Users, Shield, Globe, Cpu, Star,
    Menu, X, ChevronRight, Layers, Sparkles, Github
} from 'lucide-react';

const FEATURES = [
    { label: 'Daily Progress Circle', free: true, premium: true },
    { label: 'Task Management', free: 'Basic', premium: 'Advanced' },
    { label: 'Neural Immersion (Video)', free: false, premium: 'Full Ecosystem' },
    { label: 'Focus Clock Protocols', free: 'Pomodoro & Flow', premium: 'All Advanced Protocols' },
    { label: 'Streak Tracking', free: 'Basic', premium: 'Advanced analytics' },
    { label: 'Habit Tracking', free: '5 habits max', premium: 'Unlimited habits' },
    { label: 'Habit Categories', free: false, premium: true },
    { label: 'Progress Statistics', free: 'Basic', premium: 'Detailed charts' },
    { label: 'Reminders', free: false, premium: 'Smart reminders' },
    { label: 'Data Export (PDF)', free: false, premium: true },
    { label: 'Themes / Customization', free: false, premium: true },
    { label: 'AI Habit Insights', free: false, premium: true },
    { label: 'Premium Profile Badge', free: false, premium: true },
    { label: 'Priority Support', free: false, premium: true },
    { label: 'Ads', free: 'Google AdSense ads', premium: 'No ads' },
];

export function Landing() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pricing, setPricing] = useState({
        monthly: '149',
        yearly: '1299'
    });

    useSEO('ProgressCircle | Modern Productivity & Habit Tracking', 'A clean, high-performance ecosystem for focusing on what matters. Track tasks, build habits, and grow your digital legacy.');
    const location = useLocation();

    // Capture referral code from URL
    const query = new URLSearchParams(location.search);
    const ref = query.get('ref');

    const handleGetStarted = () => {
        const path = ref ? `/login?mode=register&ref=${ref}` : '/login';
        navigate(path);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        fetch(`${apiUrl}/subscription/pricing`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setPricing(prev => ({
                        ...prev,
                        monthly: Math.round(data.monthlyPriceCents / 100),
                        yearly: Math.round(data.yearlyPriceCents / 100)
                    }));
                }
            })
            .catch(() => { });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-[#F8FAFC] font-inter selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
            {/* Background Subtle Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse-soft" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
            </div>

            {/* Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
                        ? 'bg-[#0B0B0F]/90 backdrop-blur-xl border-white/[0.08] py-3'
                        : 'bg-transparent border-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                            <Target size={18} className="text-white" />
                        </div>
                        <span className="font-outfit font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            ProgressCircle
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <NavLink href="#features">Features</NavLink>
                        <NavLink href="#ecosystem">Ecosystem</NavLink>
                        <NavLink href="#pricing">Pricing</NavLink>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to={ref ? `/login?ref=${ref}` : "/login"} className="text-sm font-medium text-white/50 hover:text-white transition-colors">Sign In</Link>
                        <button
                            onClick={handleGetStarted}
                            className="relative group px-6 py-2.5 bg-white text-[#0B0B0F] text-sm font-bold rounded-full overflow-hidden transition-all hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-white/5"
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden p-2 text-white/70" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-[#0B0B0F]/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
                        >
                            <div className="p-8 flex flex-col gap-6">
                                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Features</a>
                                <a href="#ecosystem" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Ecosystem</a>
                                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Pricing</a>
                                <hr className="border-white/5" />
                                <Link to={ref ? `/login?ref=${ref}` : "/login"} onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-indigo-400">Sign In</Link>
                                <button onClick={handleGetStarted} className="w-full py-4 bg-white text-[#0B0B0F] rounded-2xl font-bold text-lg">Get Started</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-48 pb-32 px-6">
                    <div className="max-w-6xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-12 shadow-sm"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400/90 py-0.5">
                                Redefining Focus
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-8xl font-outfit font-bold tracking-tight mb-10 leading-[1.02]"
                        >
                            Elevate your <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-[length:200%_auto] animate-gradient-slow">
                                Productivity
                            </span> <br className="md:hidden" /> with simple precision.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-16 leading-relaxed font-light tracking-tight"
                        >
                            A clean, high-performance ecosystem designed for high-performers. <br className="hidden sm:block" />
                            Sync your tasks, habits, and biological rhythms into a unified mission.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <button
                                onClick={handleGetStarted}
                                className="group relative w-full sm:w-auto px-10 py-4.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-bold text-lg shadow-2xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span>Start Your Mission</span>
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                className="w-full sm:w-auto px-10 py-4.5 bg-white/[0.03] border border-white/[0.1] rounded-full font-bold text-lg text-white/70 hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-all active:scale-[0.98]"
                            >
                                Learn More
                            </button>
                        </motion.div>
                    </div>

                    {/* Subtle Motion Decor */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full max-w-6xl aspect-square">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-violet-500/5 blur-[120px] rounded-full animate-pulse-soft" />
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 px-6 border-t border-white/[0.03] relative overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="text-center mb-24"
                        >
                            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-outfit font-bold mb-6">Built for elite performance.</motion.h2>
                            <motion.p variants={fadeInUp} className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
                                Experience a set of modules designed to streamline every aspect of your professional and personal life.
                            </motion.p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Layers size={24} />}
                                title="Master Plan"
                                desc="Advanced task management with mission containers and priority logic."
                                color="indigo"
                            />
                            <FeatureCard
                                icon={<Activity size={24} />}
                                title="Physiological Sync"
                                desc="Synchronize your nutrition and fitness with your productivity peaks."
                                color="violet"
                            />
                            <FeatureCard
                                icon={<BarChart3 size={24} />}
                                title="Operational Metrics"
                                desc="High-fidelity heatmaps and projected focus session velocity."
                                color="blue"
                            />
                            <FeatureCard
                                icon={<Zap size={24} />}
                                title="Focus Protocols"
                                desc="Deep work sessions using Pomodoro and advanced flow states."
                                color="yellow"
                            />
                            <FeatureCard
                                icon={<Sparkles size={24} />}
                                title="Digital Legacy"
                                desc="Avatar shop, focus farms, and leveling up your digital persona."
                                color="indigo"
                            />
                            <FeatureCard
                                icon={<Users size={24} />}
                                title="Synergy Arena"
                                desc="Multi-user missions, shared progress, and competitive leaderboards."
                                color="emerald"
                            />
                        </div>
                    </div>
                </section>

                {/* Ecosystem Highlight */}
                <section id="ecosystem" className="py-32 px-6 bg-white/[0.01] border-y border-white/[0.03] relative overflow-hidden">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-6xl font-outfit font-bold mb-8 leading-tight tracking-tight">Your digital <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">expansion.</span></h2>
                            <p className="text-white/40 text-lg mb-12 leading-relaxed font-light">
                                ProgressCircle isn't just a tracker; it's a living digital structure of your efforts. Watch your potential grow as you manifest your goals.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <StatItem icon={<Trophy className="text-indigo-400" />} label="Avg. Efficiency" value="82%" />
                                <StatItem icon={<Users className="text-violet-400" />} label="Community" value="25k+" />
                                <StatItem icon={<Shield className="text-blue-400" />} label="Privacy" value="100%" />
                                <StatItem icon={<Star className="text-yellow-500" />} label="User Rating" value="4.9/5" />
                            </div>
                        </div>
                        <div className="flex-1 w-full relative">
                            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full" />
                            <div className="relative bg-[#12121A] border border-white/[0.08] rounded-[2.5rem] p-10 md:p-16 overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                                <Zap size={24} className="text-indigo-400" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black tracking-widest uppercase text-white/30 mb-1">Current Sync</div>
                                                <div className="text-xl font-bold font-outfit uppercase">Legacy Master V</div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase rounded-lg">Top 1%</div>
                                    </div>
                                    <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '82%' }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                                            <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Focus Points</div>
                                            <div className="text-2xl font-bold font-outfit">1,240</div>
                                        </div>
                                        <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                                            <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Day Streak</div>
                                            <div className="text-2xl font-bold font-outfit text-indigo-400">12 Days</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="py-32 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col items-center">
                        <div className="text-center mb-24">
                            <h2 className="text-3xl md:text-5xl font-outfit font-bold mb-6">Simple, fair pricing.</h2>
                            <p className="text-white/40 text-lg">Choose the tier that fits your journey.</p>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
                            <PricingCard
                                title="Free Starter"
                                price="0"
                                period="EGP / forever"
                                features={FEATURES.map(f => ({ label: f.label, value: f.free }))}
                                btnText="Get Started"
                                onAction={handleGetStarted}
                            />
                            <PricingCard
                                title="Elite Premium"
                                price={pricing.monthly}
                                period="EGP / month"
                                featured
                                features={FEATURES.map(f => ({ label: f.label, value: f.premium }))}
                                btnText="Go Premium"
                                onAction={handleGetStarted}
                            />
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 px-6">
                    <div className="max-w-5xl mx-auto bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.08] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] group-hover:bg-indigo-500/20 transition-colors duration-1000" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/10 blur-[100px] group-hover:bg-violet-500/20 transition-colors duration-1000" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-outfit font-bold mb-8 tracking-tight">Ready to master your time?</h2>
                            <p className="text-white/40 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed font-light">
                                Join our circle of high-performers today and begin your digital expansion.
                            </p>
                            <button
                                onClick={handleGetStarted}
                                className="px-12 py-5 bg-white text-[#0B0B0F] rounded-full font-bold text-xl hover:scale-105 hover:bg-neutral-100 transition-all duration-300 shadow-2xl shadow-white/10 active:scale-95"
                            >
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-24 px-6 border-t border-white/[0.03] bg-white/[0.01]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Target size={16} className="text-white" />
                        </div>
                        <span className="font-outfit font-bold text-lg tracking-tight">ProgressCircle</span>
                    </div>

                    <div className="flex gap-12">
                        <FooterLink href="#">Privacy</FooterLink>
                        <FooterLink href="#">Terms</FooterLink>
                        <FooterLink href="#">Security</FooterLink>
                        <FooterLink href="#">Blog</FooterLink>
                    </div>

                    <div className="flex gap-6 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                        <Github className="cursor-pointer" size={20} />
                        <Globe className="cursor-pointer" size={20} />
                        <Cpu className="cursor-pointer" size={20} />
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-10 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/20 text-[10px] font-black tracking-[0.2em] uppercase">
                        &copy; 2026 PROGRESS CIRCLE. ALL SYSTEMS NOMINAL.
                    </p>
                    <p className="text-white/10 text-[10px] font-mono uppercase">
                        Protocol v4.2.0-Alpha
                    </p>
                </div>
            </footer>

            <style jsx global>{`
                @keyframes gradient-slow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-slow {
                    animation: gradient-slow 8s ease infinite;
                }
                @keyframes pulse-soft {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                .animate-pulse-soft {
                    animation: pulse-soft 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

// Sub-components
function NavLink({ href, children }) {
    return (
        <a
            href={href}
            className="relative text-sm font-semibold text-white/40 hover:text-white transition-colors duration-300 py-1 group"
        >
            {children}
            <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-500 transition-all duration-500 group-hover:w-full" />
        </a>
    );
}

function FeatureCard({ icon, title, desc, color }) {
    const colorClasses = {
        indigo: 'text-indigo-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-300',
        violet: 'text-violet-400 group-hover:bg-violet-500/10 group-hover:text-violet-300',
        blue: 'text-blue-400 group-hover:bg-blue-500/10 group-hover:text-blue-300',
        yellow: 'text-yellow-500 group-hover:bg-yellow-500/10 group-hover:text-yellow-400',
        emerald: 'text-emerald-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-300',
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="p-10 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 group"
        >
            <div className={`w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${colorClasses[color]}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold font-outfit mb-4 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-white/30 text-base leading-relaxed group-hover:text-white/50 transition-colors">{desc}</p>
        </motion.div>
    );
}

function StatItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-5 group">
            <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:border-white/10 transition-all">
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black tracking-[0.2em] text-white/30 mb-0.5">{label}</div>
                <div className="text-2xl font-bold font-outfit">{value}</div>
            </div>
        </div>
    );
}

function FeatureValue({ value }) {
    if (value === true) return <CheckCircle2 size={18} className="text-indigo-400" />;
    if (value === false) return <X size={18} className="text-white/20" />;
    return <span className="text-[10px] font-black uppercase text-indigo-400 border border-indigo-400/20 px-1.5 py-0.5 rounded leading-none">{value}</span>;
}

function PricingCard({ title, price, period, features, featured = false, btnText, onAction }) {
    return (
        <div className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col relative overflow-hidden ${featured
                ? 'bg-gradient-to-b from-indigo-500/[0.07] to-transparent border-indigo-500/30 shadow-2xl shadow-indigo-500/10'
                : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
            }`}>
            {featured && (
                <div className="absolute top-6 right-8 px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                    Most Popular
                </div>
            )}
            <div className="mb-10">
                <h3 className="text-2xl font-bold font-outfit mb-3">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold font-outfit tracking-tighter">{price}</span>
                    {period && <span className="text-white/30 text-xs font-black tracking-widest uppercase">{period}</span>}
                </div>
            </div>
            <ul className="space-y-4 mb-12 flex-grow">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-4 text-white/50 group/item">
                        <FeatureValue value={f.value} />
                        <span className="text-sm font-medium group-hover/item:text-white/80 transition-colors">{f.label}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={onAction}
                className={`w-full py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${featured
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30'
                        : 'bg-white/[0.04] border border-white/10 text-white hover:bg-white/10'
                    }`}
            >
                {btnText}
            </button>
        </div>
    );
}

function FooterLink({ href, children }) {
    return (
        <a href={href} className="text-[11px] font-black tracking-[0.2em] uppercase text-white/30 hover:text-indigo-400 transition-colors duration-300">
            {children}
        </a>
    );
}
