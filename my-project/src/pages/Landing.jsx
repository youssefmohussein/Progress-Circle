import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    Zap, Shield, Users, Activity, Trophy, 
    ChevronRight, ArrowDown, ArrowRight, Star, Globe, 
    BarChart3, Heart, Target, Layers, 
    Smartphone, Cpu, Sparkles, CheckCircle2,
    Lock, ZapOff, Cloud, Network, Orbit,
    Terminal, Database, Radio, Fingerprint,
    TrendingUp, Gift, Flame, Mail, Award,
    Boxes, Layout as LayoutIcon, Laptop, MousePointer2, Box
} from 'lucide-react';

export function Landing() {
    const navigate = useNavigate();
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#020204] text-[#f8fafc] selection:bg-indigo-500/30 selection:text-white font-inter antialiased overflow-x-hidden scroll-smooth transition-all duration-700 pc-noise">
            {/* Elite Progress HUD */}
            <div className="fixed top-0 left-0 w-full h-[2px] bg-white/[0.03] z-[100]">
                <div 
                    className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] transition-all duration-200 ease-out" 
                    style={{ width: `${scrollProgress}%` }} 
                />
            </div>

            {/* Neural Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-[90] bg-[#020204]/70 backdrop-blur-3xl border-b border-white/[0.03] transition-all duration-500">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-600/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                            <Target size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col -gap-1">
                            <span className="font-extrabold text-xl tracking-tighter uppercase leading-none font-outfit">
                                Progress<span className="text-indigo-500">Circle</span>
                            </span>
                            <span className="text-[7px] font-black tracking-[0.6em] text-zinc-700 uppercase">Apex Alpha v5.0</span>
                        </div>
                    </div>
                    
                    <nav className="hidden lg:flex items-center gap-12">
                        <NavLink href="#odyssey">Mission</NavLink>
                        <NavLink href="#intelligence">Modules</NavLink>
                        <NavLink href="#ecosystem">Ecosystem</NavLink>
                        <NavLink href="#growth">Protocol</NavLink>
                        <NavLink href="#pricing">Access</NavLink>
                    </nav>

                    <div className="flex items-center gap-8">
                        <Link to="/login" className="hidden sm:block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-all">Authorize</Link>
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95"
                        >
                            Open Hub
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* APEX HERO: Fluid Scaling & High-Impact */}
                <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
                    {/* Background Detail */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.08)_0%,transparent_50%)]" />
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay -z-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                    <div className="max-w-[1400px] mx-auto text-center relative z-10 w-full">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-[#94a3b8] text-[9px] uppercase font-bold tracking-[0.4em] mb-16 shadow-2xl backdrop-blur-md">
                            <Orbit size={11} className="text-indigo-500 animate-spin-slow" /> Neural Synchronization Active
                        </div>
                        
                        <h1 className="font-outfit font-black tracking-[-0.05em] leading-[0.82] text-white italic transition-all duration-700">
                            <span className="block text-[clamp(4.5rem,14vw,14rem)] drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]">APEX ELITE</span>
                            <span className="block text-[clamp(4.5rem,14vw,14rem)] not-italic text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 drop-shadow-[0_0_40px_rgba(99,102,241,0.3)]">COMMAND</span>
                        </h1>
                        
                        <p className="text-[clamp(1.1rem,2.5vw,1.75rem)] text-[#64748b] max-w-4xl mx-auto mt-16 mb-24 leading-tight font-medium tracking-tight px-4">
                            The definitive high-fidelity ecosystem for top-tier operatives. <br className="hidden lg:block" /> 
                            <span className="text-[#334155]">Unify your cognitive, biological, and social trajectories.</span>
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 w-full px-6">
                            <button 
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-16 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-extrabold text-2xl hover:bg-indigo-500 hover:scale-[1.03] transition-all shadow-[0_20px_80px_rgba(79,70,229,0.4)] active:scale-95 group flex items-center justify-center gap-4"
                            >
                                Initiate Launch <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                            <Link to="/login" className="w-full sm:w-auto px-12 py-8 bg-white/[0.02] border border-white/[0.06] rounded-[2.5rem] font-bold text-lg hover:bg-white/[0.05] transition-all flex items-center justify-center gap-3 backdrop-blur-lg">
                                Access Manifesto <MousePointer2 size={24} className="text-zinc-600" />
                            </Link>
                        </div>
                    </div>

                    {/* Elite Scroll Cue */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group" onClick={() => document.getElementById('odyssey').scrollIntoView()}>
                        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent group-hover:via-indigo-500 transition-all duration-1000" />
                        <span className="text-[8px] font-black uppercase tracking-[0.8em] text-zinc-800 group-hover:text-indigo-400 transition-colors">Odyssey Entry</span>
                    </div>
                </section>

                {/* THE ODYSSEY: High-Fidelity Philosophy */}
                <section id="odyssey" className="py-60 px-6 md:px-12 relative border-t border-white/[0.02]">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.7em] text-indigo-500 mb-8 block font-outfit">Sovereign Philosophy</span>
                                <h2 className="font-outfit text-6xl md:text-8xl font-black mb-12 leading-[0.85] tracking-tight">Elegance is <br /> <span className="text-zinc-800 italic">Efficiency.</span></h2>
                                <p className="text-xl md:text-2xl text-[#64748b] leading-relaxed mb-16 font-medium max-w-xl">
                                    Progress Circle is built for those who find peace in precision. A world-class interface that transforms chaotic existence into a unified mission trajectory.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                    <EliteNarrativeItem icon={Box} title="Atomic Logic" val="Every session matters." />
                                    <EliteNarrativeItem icon={LayoutIcon} title="Tactical HUD" val="Designed for focus." />
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/5] bg-gradient-to-br from-indigo-500/5 to-transparent border border-white/[0.03] rounded-[5rem] overflow-hidden p-2 shadow-2xl">
                                    <div className="w-full h-full bg-[#050508] rounded-[4.8rem] flex flex-col items-center justify-center gap-12 relative group shadow-inner">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
                                        <div className="relative">
                                            <div className="w-40 h-40 bg-indigo-500/5 rounded-full border border-indigo-500/10 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/20 transition-all duration-1000">
                                                <Orbit size={80} className="text-indigo-600/30 group-hover:rotate-180 transition-transform duration-1000 ease-in-out" />
                                            </div>
                                        </div>
                                        <div className="text-center relative">
                                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500/40 mb-3 block">Neural Link Stable</span>
                                            <h4 className="font-outfit text-3xl font-black italic tracking-tighter text-zinc-300">CORE_PROTOCOL_01</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE CORE MODULES: Intelligence & Biology */}
                <section id="intelligence" className="py-40 px-6 md:px-12 bg-[#050508]/50 border-y border-white/[0.02]">
                    <div className="max-w-7xl mx-auto">
                        <SectionHeader 
                            label="Elite Modules"
                            title="Dual-Core Intelligence"
                            subtitle="Synchronizing your cognitive and physiological centers."
                        />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Intelligence Card */}
                            <div className="lg:col-span-12 xl:col-span-7 bg-[#0a0a0f] border border-white/[0.03] rounded-[4rem] p-12 md:p-20 relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-700">
                                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-125 transition-transform duration-1000">
                                    <Cpu size={300} />
                                </div>
                                <div className="relative z-10 max-w-lg">
                                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-12 shadow-2xl shadow-indigo-600/20">
                                        <Layers size={32} />
                                    </div>
                                    <h3 className="font-outfit text-5xl font-black mb-8 tracking-tighter">INTELLIGENCE <br /> <span className="text-zinc-800">MODULE_01</span></h3>
                                    <p className="text-xl text-[#64748b] mb-12 font-medium leading-relaxed">
                                        Architected for deep productivity. Astra AI analyzes your focus patterns to predict your next peak output window.
                                    </p>
                                    <div className="grid grid-cols-2 gap-8">
                                        <TacticalFeature icon={Terminal} label="Sub-Task Nesting" />
                                        <TacticalFeature icon={BarChart3} label="Habit Heatmaps" />
                                        <TacticalFeature icon={Sparkles} label="AI Predictions" />
                                        <TacticalFeature icon={Zap} label="Rapid Sync" />
                                    </div>
                                </div>
                            </div>

                            {/* Biology Card */}
                            <div className="lg:col-span-12 xl:col-span-5 bg-[#0a0a0f] border border-white/[0.03] rounded-[4rem] p-12 md:p-20 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-12">
                                        <Activity size={32} />
                                    </div>
                                    <h3 className="font-outfit text-4xl font-black mb-10 tracking-tighter italic">BIO_CENTER <span className="text-zinc-800">02</span></h3>
                                    <div className="space-y-16">
                                        <EliteMetric label="Fuel Reserve" val="8.2" unit="L" percent={82} color="indigo" />
                                        <EliteMetric label="Neural State" val="Optimal" unit="" percent={95} color="emerald" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE ECOSYSTEM: Gamification Reborn */}
                <section id="ecosystem" className="py-60 px-6 md:px-12 relative text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_60%)] -z-10" />
                    <div className="max-w-5xl mx-auto">
                        <SectionHeader 
                            label="Digital Legacy"
                            title="The Visual Farm"
                            subtitle="Every focus block manifests as a living digital structure."
                            center
                        />
                        
                        <div className="bg-[#0a0a0f] border border-white/[0.03] rounded-[5rem] p-12 md:p-32 relative overflow-hidden group shadow-4xl mb-24">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] scale-150"><Boxes size={400} /></div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
                                <LegacyStat icon={Award} label="Exp" val="4.2k" />
                                <LegacyStat icon={Flame} label="Heat" val="12" />
                                <LegacyStat icon={Trophy} label="Rank" val="Elite" />
                                <LegacyStat icon={TrendingUp} label="Growth" val="+12%" />
                            </div>
                            <div className="mt-24 max-w-2xl mx-auto">
                                <p className="text-xl md:text-2xl text-[#64748b] font-medium leading-relaxed mb-12">
                                    Your effort is no longer abstract. The Focus Farm visualizes your growth in real-time. Build your empire through synchronization.
                                </p>
                                <div className="flex justify-center -space-x-4 mb-8">
                                    {[1,2,3,4,5,6].map(i => <div key={i} className="w-14 h-14 rounded-full border-[6px] border-[#0a0a0f] bg-zinc-800 shadow-xl" />)}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.6em] text-indigo-500/60 block">Global Operative Wall Integration Active</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE SOCIAL FREQUENCY: Synergy Protocol */}
                <section id="social" className="py-40 px-6 md:px-12 border-t border-white/[0.02]">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="aspect-video bg-[#0a0a0f] border border-white/[0.03] rounded-[3.5rem] p-1.5 shadow-2xl overflow-hidden group">
                                <div className="w-full h-full bg-[#020204] rounded-[3.35rem] relative p-12 flex flex-col items-center justify-center gap-10">
                                    <Radio size={100} className="text-indigo-600/20 group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="flex gap-4">
                                        {[1,2,3].map(i => <div key={i} className={`h-1.5 w-12 rounded-full ${i === 1 ? 'bg-indigo-500' : 'bg-zinc-800'}`} />)}
                                    </div>
                                    <span className="text-[10px] font-black tracking-[0.5em] text-zinc-700 uppercase">Live_Squad_Broadcast</span>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                           <SectionHeader 
                                label="Collective Power"
                                title="Social Synergy"
                                subtitle="Squad-based synchronization for high-intensity missions."
                           />
                           <div className="space-y-12">
                               <EliteDetailItem 
                                    icon={Users}
                                    title="Syndicate Wall"
                                    desc="Witness every task completion live across your private squad network."
                               />
                               <EliteDetailItem 
                                    icon={Target}
                                    title="Battle Arena"
                                    desc="Synchronized timer rooms for high-stakes focus rounds with friends."
                               />
                               <EliteDetailItem 
                                    icon={Shield}
                                    title="Peer Authority"
                                    desc="Assign mission targets to squad mates and track verification status."
                               />
                           </div>
                        </div>
                    </div>
                </section>

                {/* GROWTH & MOBILE: The Infrastructure */}
                <section id="growth" className="py-60 px-6 md:px-12 relative overflow-hidden border-t border-white/[0.02]">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
                            <div className="lg:col-span-7">
                                <SectionHeader 
                                    label="Syndicate Growth"
                                    title="Referral Protocol"
                                    subtitle="Operatives grow the circle. Rewards follow loyalty."
                                />
                                <div className="bg-[#0a0a0f] border border-white/[0.03] rounded-[4rem] p-12 md:p-20 relative group hover:border-indigo-500/20 transition-all">
                                    <div className="absolute top-10 right-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                        <Gift size={200} />
                                    </div>
                                    <p className="text-2xl text-[#64748b] leading-tight mb-16 font-medium">
                                        Invite 3 high-performers. Once synchronized, your clearance is upgraded to <span className="text-white italic">Premium Operative</span> for 30 cycles.
                                    </p>
                                    <div className="flex flex-wrap gap-12">
                                        <ApexStat label="Recruited" val="00" />
                                        <div className="w-[1px] h-12 bg-white/5" />
                                        <ApexStat label="Legacy Earning" val="+30% Exp" />
                                    </div>
                                    <button className="mt-16 group flex items-center gap-4 text-[10px] font-black tracking-[0.4em] uppercase text-[#334155] hover:text-white transition-all">
                                        Initiate Protocol <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>
                            <div className="lg:col-span-5 flex justify-center">
                                {/* ELITE MOBILE HUD SIMULATION */}
                                <div className="w-80 h-[640px] bg-zinc-950 border-[10px] border-zinc-900 rounded-[4rem] relative overflow-hidden shadow-4xl group">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-900 rounded-b-3xl z-10" />
                                    <div className="p-8 pt-16 h-full flex flex-col gap-10 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                                        <div className="flex items-center justify-between">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20" />
                                            <div className="flex flex-col gap-2 items-end">
                                                <div className="w-16 h-2 bg-zinc-800 rounded-full" />
                                                <div className="w-8 h-2 bg-zinc-800 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8">
                                            <div className="w-full h-32 bg-indigo-500/10 rounded-3xl mb-8" />
                                            <div className="space-y-4">
                                                {[1,2,3,4].map(i => <div key={i} className="h-10 w-full bg-zinc-900/50 rounded-2xl" />)}
                                            </div>
                                        </div>
                                        <div className="flex justify-around pb-4">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500" />
                                            <div className="w-8 h-8 rounded-full bg-zinc-800" />
                                            <div className="w-8 h-8 rounded-full bg-zinc-800" />
                                            <div className="w-8 h-8 rounded-full bg-zinc-800" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ACCESS PROTOCOL: Elite Pricing */}
                <section id="pricing" className="py-60 px-6 md:px-12 relative border-t border-white/[0.02]">
                    <div className="max-w-6xl mx-auto flex flex-col items-center">
                        <SectionHeader 
                            label="Clearing Level"
                            title="Operative Tiers"
                            subtitle="Choose the intensity of your mission sync."
                            center
                        />
                        
                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Standard Operative */}
                            <div className="p-16 bg-[#0a0a0f] border border-white/[0.03] rounded-[4rem] group hover:border-zinc-700 transition-all duration-700 relative overflow-hidden">
                                <h4 className="font-outfit text-3xl font-black mb-6 uppercase italic">Operative_Core</h4>
                                <div className="font-outfit text-7xl font-black mb-12 tracking-tighter text-white/50">$0 <span className="text-xl text-zinc-800 uppercase tracking-widest font-inter">Infinite</span></div>
                                <ul className="space-y-6 text-[#64748b] font-medium mb-16 text-lg">
                                    <li className="flex items-start gap-4"><CheckCircle2 size={24} className="text-zinc-800 mt-1" /> Standard Intelligence Hub</li>
                                    <li className="flex items-start gap-4"><CheckCircle2 size={24} className="text-zinc-800 mt-1" /> Core Biological Tracking</li>
                                    <li className="flex items-start gap-4"><CheckCircle2 size={24} className="text-zinc-800 mt-1" /> Personal Focus Farm</li>
                                    <li className="flex items-start gap-4"><ZapOff size={24} className="text-zinc-900 mt-1" /> Syndicate Arena Locked</li>
                                </ul>
                                <button className="w-full py-7 bg-zinc-900 text-zinc-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-zinc-800 transition-all">Submit Entry Request</button>
                            </div>

                            {/* Apex Operative */}
                            <div className="p-16 bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/30 rounded-[4rem] group shadow-[0_0_100px_rgba(99,102,241,0.1)] relative overflow-hidden lg:-translate-y-8 lg:scale-105">
                                <div className="absolute top-0 right-10 bg-indigo-600 text-[9px] font-black px-6 py-2.5 rounded-b-2xl uppercase tracking-[0.4em]">Apex Priority</div>
                                <h4 className="font-outfit text-3xl font-black mb-6 uppercase italic text-indigo-400">Operative_Apex</h4>
                                <div className="font-outfit text-7xl font-black mb-12 tracking-tighter text-white">$9.99 <span className="text-xl text-indigo-500/30 uppercase tracking-widest font-inter">Cycle</span></div>
                                <ul className="space-y-6 text-[#94a3b8] font-medium mb-16 text-lg">
                                    <li className="flex items-start gap-4"><CheckCircle2 size={24} className="text-indigo-500 mt-1" /> All Syndicate Arena Missions</li>
                                    <li className="flex items-start gap-4"><CheckCircle2 size={24} className="text-indigo-500 mt-1" /> Full Astra AI Deep-Analytics</li>
                                    <li className="flex items-start gap-4"><CheckCircle2 size={24} className="text-indigo-500 mt-1" /> Physiological Correlator Pro</li>
                                    <li className="flex items-start gap-4"><CheckCircle2 size={24} className="text-indigo-500 mt-1" /> Global Syndicate Wall Ranking</li>
                                    <li className="flex items-start gap-4"><CheckCircle2 size={24} className="text-indigo-500 mt-1" /> Bio-Metric Notification Bridge</li>
                                </ul>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="w-full py-7 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-indigo-500 shadow-2xl shadow-indigo-600/30 transition-all active:scale-95"
                                >
                                    Initiate Full Sync
                                </button>
                            </div>
                        </div>
                        <p className="mt-24 text-[10px] font-black text-zinc-800 uppercase tracking-[0.6em]">Growth Clause: Invite 3 Recruits for 1 Cycle of Apex Clearance.</p>
                    </div>
                </section>

                {/* THE TERMINATION: Final Deployment */}
                <section className="py-60 px-6 md:px-12 relative overflow-hidden">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="bg-gradient-to-br from-indigo-700 to-indigo-950 rounded-[6rem] p-16 md:p-40 text-center relative overflow-hidden shadow-4xl group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.1)_0%,transparent_60%)] -z-10" />
                            <div className="absolute top-0 right-0 p-24 opacity-10 group-hover:scale-125 transition-transform duration-[3s]"><Orbit size={600} /></div>
                            
                            <span className="text-[12px] font-black text-white/30 uppercase tracking-[1em] mb-12 block relative z-10 transition-all group-hover:tracking-[1.5em]">Final Clearance</span>
                            <h2 className="font-outfit text-7xl md:text-[14rem] font-black tracking-[-0.06em] mb-16 relative z-10 leading-[0.75] italic group-hover:scale-105 transition-all duration-1000">DEPLOY <br /> MISSION.</h2>
                            <p className="text-white/70 text-2xl md:text-3xl font-medium mb-24 max-w-2xl mx-auto relative z-10 leading-tight">
                                Don't just watch the Odyssey. <br className="hidden md:block" /> 
                                <span className="text-white font-black italic">Synchronize with it.</span>
                            </p>
                            
                            <div className="flex flex-col items-center gap-12 relative z-20">
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="px-24 py-10 bg-white text-indigo-900 rounded-[3.5rem] font-black text-4xl hover:scale-110 hover:shadow-4xl active:scale-95 transition-all duration-500"
                                >
                                    Initiate Now
                                </button>
                                <div className="flex flex-wrap items-center justify-center gap-16 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">
                                    <div className="flex items-center gap-3"><Shield size={18} /> Hardened Protocol</div>
                                    <div className="flex items-center gap-3"><Target size={18} /> Tier-0 Infrastructure</div>
                                    <div className="flex items-center gap-3"><Laptop size={18} /> Global Sync</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* APEX FOOTER */}
            <footer className="py-40 px-6 md:px-12 bg-[#020205] border-t border-white/[0.02]">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-24 xl:gap-40 items-start">
                    <div className="xl:col-span-4">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <Target size={20} className="text-white" />
                            </div>
                            <span className="font-black text-2xl tracking-tighter uppercase italic font-outfit">ProgressCircle</span>
                        </div>
                        <p className="text-[#64748b] text-xl leading-relaxed mb-16 font-medium">
                            Architecting the definitive infrastructure for the modern operative. Unify your trajectory. Maximize your throughput.
                        </p>
                        <div className="flex gap-4">
                            {[1,2,3].map(i => <div key={i} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"><Star size={18} className="text-zinc-700" /></div>)}
                        </div>
                    </div>

                    <div className="xl:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-16">
                        <EliteFooterCol title="Odyssey" links={['The Vision', 'Modules', 'Ecosystem', 'Synergy']} />
                        <EliteFooterCol title="Operative" links={['Clearance', 'Security', 'Manifesto', 'Support']} />
                        <EliteFooterCol title="Protocol" links={['Privacy', 'Mission Terms', 'Cookie Log']} />
                        <EliteFooterCol title="Link" links={['Twitter', 'Discord', 'Github']} />
                    </div>
                </div>
                <div className="max-w-[1440px] mx-auto mt-40 pt-12 border-t border-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col gap-2 scale-75 md:scale-100 items-center md:items-start text-center md:text-left">
                        <span className="text-[10px] font-black text-zinc-900 uppercase tracking-[1em]">© 2026 PROGRESS CIRCLE</span>
                        <span className="text-[8px] font-black text-zinc-900 uppercase tracking-[0.5em]">APEX_ELITE_TERMINATION_PROTOCOL_ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-12 grayscale opacity-10 hover:grayscale-0 hover:opacity-40 transition-all duration-1000">
                        <Shield size={32} /> <Globe size={32} /> <Cpu size={32} /> <Database size={32} />
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ELITE HELPER COMPONENTS

function NavLink({ href, children }) {
    return (
        <a 
            href={href} 
            className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-all hover:tracking-[0.5em] relative group py-2"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-indigo-600 transition-all duration-500 group-hover:w-full rounded-full" />
        </a>
    );
}

function EliteNarrativeItem({ icon: Icon, title, val }) {
    return (
        <div className="flex items-center gap-6 group">
            <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex items-center justify-center group-hover:bg-indigo-600/10 group-hover:border-indigo-500/20 transition-all duration-500 shrink-0 shadow-lg">
                <Icon size={24} className="text-zinc-600 group-hover:text-indigo-400" />
            </div>
            <div>
                <h4 className="font-outfit text-xl font-black mb-1 text-white uppercase italic tracking-tighter">{title}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#475569]">{val}</p>
            </div>
        </div>
    );
}

function SectionHeader({ label, title, subtitle, center }) {
    return (
        <div className={`mb-24 ${center ? 'flex flex-col items-center text-center' : 'text-left'}`}>
            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-indigo-500 mb-8 block drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]">{label}</span>
            <h2 className={`font-outfit text-6xl md:text-8xl font-black mb-10 leading-[0.85] tracking-tight uppercase italic ${center ? 'max-w-4xl text-center' : ''}`}>{title}</h2>
            <p className="text-2xl text-[#64748b] max-w-2xl font-medium tracking-tight">{subtitle}</p>
        </div>
    );
}

function TacticalFeature({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:text-indigo-500 transition-colors shrink-0">
                <Icon size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-100 transition-colors">{label}</span>
        </div>
    );
}

function EliteMetric({ label, val, unit, percent, color }) {
    const colors = {
        indigo: 'bg-indigo-600 shadow-indigo-600/30',
        emerald: 'bg-emerald-600 shadow-emerald-600/30'
    };
    return (
        <div className="space-y-5">
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#475569]">{label}</span>
                    <span className="font-outfit text-4xl font-black text-white italic tracking-tighter uppercase">{val}<span className="text-sm font-inter not-italic ml-2 text-zinc-800 uppercase tracking-widest">{unit}</span></span>
                </div>
                <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest animate-pulse">Sync_In_Progress</div>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full ${colors[color]} shadow-lg transition-all duration-1000 ease-in-out`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}

function LegacyStat({ icon: Icon, label, val }) {
    return (
        <div className="flex flex-col items-center gap-6 group cursor-default">
            <div className="w-24 h-24 bg-white/[0.03] border border-white/[0.05] rounded-[2.5rem] flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/20 transition-all duration-500 shadow-2xl">
                <Icon size={36} className="text-zinc-700 group-hover:text-indigo-500" />
            </div>
            <div className="flex flex-col text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 group-hover:text-zinc-600 transition-colors mb-2">{label}</span>
                <span className="font-outfit text-4xl font-black text-white italic tracking-tighter uppercase">{val}</span>
            </div>
        </div>
    );
}

function ApexStat({ label, val }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-2">{label}</span>
            <span className="font-outfit text-5xl font-black text-white italic tracking-tighter uppercase">{val}</span>
        </div>
    );
}

function EliteDetailItem({ icon: Icon, title, desc }) {
    return (
        <div className="flex items-start gap-8 group">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-500 shrink-0 shadow-xl group-hover:rotate-[15deg] group-hover:scale-110">
                <Icon size={28} className="text-zinc-600 group-hover:text-white" />
            </div>
            <div>
                <h4 className="font-outfit text-2xl font-black text-white mb-3 tracking-tight group-hover:italic group-hover:text-indigo-400 transition-all uppercase italic">SYNC_{title}</h4>
                <p className="text-lg text-[#64748b] leading-relaxed font-medium">{desc}</p>
            </div>
        </div>
    );
}

function EliteFooterCol({ title, links }) {
    return (
        <div className="flex flex-col gap-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#475569]">{title}</h5>
            <ul className="flex flex-col gap-5">
                {links.map(link => (
                    <li key={link}>
                        <a href="#" className="text-[13px] text-[#334155] hover:text-indigo-400 transition-all font-bold uppercase tracking-widest hover:pl-2">{link}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
