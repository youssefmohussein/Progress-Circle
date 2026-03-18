import React, { useState } from 'react';
import { Info, Zap, Activity, Layers, Target, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';

/**
 * [APEX ELITE V2.2] - Page Insight Engine
 * High-fidelity instructional overlay for top-tier operations.
 */
export function PageInsight({ title, intro, operations, neuralTip }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="group relative flex items-center justify-center w-9 h-9 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-lg shadow-indigo-600/5 active:scale-90"
                title="Neural Insight"
            >
                <Info size={18} />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
            </button>

            <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Neural Intelligence Feed" maxWidth="600px">
                <div className="space-y-10 py-4">
                    {/* Header Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                                <Zap size={24} className="pc-streak-glow" />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em]">Protocol Insight</span>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-manrope">{title}</h3>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-zinc-400 leading-relaxed font-inter pl-1 border-l-2 border-indigo-600/20 ml-1">{intro}</p>
                    </div>

                    {/* Operations Grid */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Standard Operations</h4>
                            <div className="h-[1px] flex-grow bg-white/[0.03] ml-4" />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {operations.map((op, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-[#0b0d12]/50 p-6 rounded-[1.5rem] border border-white/[0.03] flex gap-6 group hover:border-indigo-500/30 transition-all cursor-default"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-indigo-500/30 font-black text-2xl italic font-manrope group-hover:text-indigo-500 transition-colors tracking-tighter">0{idx + 1}</div>
                                        <div className="w-px h-full bg-indigo-500/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                            {op.title}
                                            <ChevronRight size={10} className="text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <div className="text-[11px] font-medium text-zinc-500 leading-relaxed max-w-sm">{op.content}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Neural Tip Section */}
                    {neuralTip && (
                        <div className="bg-indigo-600/5 p-8 rounded-[2rem] border border-indigo-500/20 relative overflow-hidden group shadow-2xl shadow-indigo-600/5">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl group-hover:bg-indigo-600/10 transition-all -z-0" />
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/20">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Neural Optimization Tip</div>
                                    <p className="text-[13px] font-bold text-zinc-300 leading-relaxed italic pr-4">"{neuralTip}"</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={() => setIsOpen(false)}
                        className="w-full py-5 bg-zinc-900/50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all border border-white/5 active:scale-[0.98] shadow-2xl"
                    >
                        Deactivate Operational Briefing
                    </button>
                </div>
            </Modal>
        </>
    );
}
