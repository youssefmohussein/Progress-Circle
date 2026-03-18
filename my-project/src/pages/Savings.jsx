import { useState, useEffect, useMemo } from 'react';
import { useSEO } from '../hooks/useSEO';

import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Plus, DollarSign, Settings, Receipt, ArrowUpCircle, ArrowDownCircle, Users, BarChart3, CreditCard, Banknote, ShieldCheck, Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { Confetti } from '../components/Confetti';
import { toast } from 'sonner';

export function Savings() {
    const { user, setUser } = useAuth();
    useSEO('Financial Command Center', 'Track income, expenses, savings goals, and net worth with the ProgressCircle financial dashboard.');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiConfig, setConfettiConfig] = useState({ theme: 'finance', variant: 'burst' });

    // Config state
    const [showConfig, setShowConfig] = useState(false);
    const [configData, setConfigData] = useState({
        totalMoney: user?.totalMoney || 0,
        monthlyIncome: user?.monthlyIncome || 0,
        cashBalance: user?.cashBalance || 0,
        creditBalance: user?.creditBalance || 0,
        savingsGoal: user?.savingsGoal || 50000
    });

    // Transaction state
    const [showTxModal, setShowTxModal] = useState(false);
    const [txData, setTxData] = useState({ type: 'expense', amount: '', category: '', description: '', fromWho: '', account: 'cash' });

    const fetchTransactions = async () => {
        if (user?.plan !== 'premium') {
            setLoading(false);
            return;
        }
        try {
            const res = await api.get('/savings');
            setTransactions(res.data.data);
        } catch (error) {
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const dashboardStats = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyTx = transactions.filter(t => new Date(t.date) >= startOfMonth);

        const monthlyIncome = monthlyTx.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
        const monthlyExpenses = monthlyTx.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
        const monthlyInvestments = monthlyTx.filter(t => t.type === 'investment').reduce((acc, curr) => acc + curr.amount, 0);

        return {
            monthlyIncome,
            monthlyExpenses,
            monthlyInvestments,
            netCashflow: monthlyIncome - monthlyExpenses - monthlyInvestments
        };
    }, [transactions]);

    const handleConfigSave = async (e) => {
        e.preventDefault();
        try {
            const updateRes = await api.put('/savings/config', {
                totalMoney: Number(configData.totalMoney),
                monthlyIncome: Number(configData.monthlyIncome),
                cashBalance: Number(configData.cashBalance),
                creditBalance: Number(configData.creditBalance),
                savingsGoal: Number(configData.savingsGoal)
            });
            setUser(updateRes.data.data);
            setConfettiConfig({ theme: 'finance', variant: 'fountain' });
            setShowConfetti(true);
            toast.success('Financial configuration saved!');
            setShowConfig(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save configuration');
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/savings', {
                ...txData,
                amount: Number(txData.amount)
            });
            setUser(res.data.user);
            
            // Differentiated Celebrations
            let config = { theme: 'finance', variant: 'burst' };
            if (txData.type === 'income') config = { theme: 'income', variant: 'rain' };
            else if (txData.type === 'expense') config = { theme: 'expense', variant: 'spiral' };
            else if (txData.type === 'investment') config = { theme: 'investment', variant: 'fountain' };
            
            setConfettiConfig(config);
            setShowConfetti(true);
            
            toast.success('Transaction logged!');
            setShowTxModal(false);
            setTxData({ type: 'expense', amount: '', category: '', description: '', fromWho: '', account: 'cash' });
            fetchTransactions();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to log transaction');
        }
    };

    if (loading) return <LoadingSpinner />;

    // Premium Gating Overlay
    if (user?.plan !== 'premium') {
        return (
            <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl">
                {/* Blurred Preview Background */}
                <div className="absolute inset-0 opacity-20 blur-xl pointer-events-none select-none grayscale">
                    <div className="p-10 space-y-8">
                        <div className="h-32 bg-white/10 rounded-3xl" />
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-24 bg-white/10 rounded-2xl" />
                            <div className="h-24 bg-white/10 rounded-2xl" />
                            <div className="h-24 bg-white/10 rounded-2xl" />
                        </div>
                        <div className="h-64 bg-white/10 rounded-3xl" />
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 max-w-md w-full p-8 text-center bg-surface/80 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                        <Crown size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-3">Treasury is Premium</h2>
                    <p className="text-muted text-sm leading-relaxed mb-8">
                        Master your wealth with advanced financial tracking. Log transactions across multiple accounts, monitor cashflow, and hit your savings goals.
                    </p>
                    
                    <div className="space-y-3 mb-8">
                        {[
                            'Unlimited Transaction Logging',
                            'Bank & Credit Account Sync (Manual)',
                            'Visual Cashflow Analytics',
                            'Savings Goal Tracking'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-white/70 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                {feature}
                            </div>
                        ))}
                    </div>

                    <Link to="/pricing">
                        <Button className="w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20 border-none transition-all">
                            Unlock Full Access
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl relative">
            {/* Background Depth Glow */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08)_0%,transparent_50%)] pointer-events-none" />
            
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold font-manrope text-white mb-1">Financial Command Center</h1>
                    <p className="text-muted">Master your wealth across Cash & Credit</p>
                </div>
                <Button variant="secondary" onClick={() => setShowConfig(true)}>
                    <Settings size={16} className="mr-2" /> Treasury Settings
                </Button>
            </div>

            {/* Main Wealth Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="relative overflow-hidden bg-surface-2 border border-white/5 group min-h-[160px] flex flex-col p-8 transition-all duration-500 hover:border-indigo-500/30">
                    {/* Centered Decorative Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center flex-1">
                        <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                            <BarChart3 size={24} />
                        </div>
                        
                        <div className="text-center space-y-1">
                            <div className="flex items-center gap-1.5 justify-center">
                                <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                                <p className="text-[10px] text-indigo-400/80 font-black uppercase tracking-[0.2em]">Combined Net Worth</p>
                            </div>
                            <p className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl">
                                <span className="text-indigo-500 mr-0.5">$</span>
                                {user?.totalMoney?.toLocaleString() || 0}
                            </p>
                            <p className="text-[10px] text-muted/60 font-bold uppercase tracking-widest pt-1">Total Valuation</p>
                        </div>
                    </div>

                    {/* Flush Bottom Foundation Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, ((user?.totalMoney || 0) / (user?.savingsGoal || 50000)) * 100)}%` }}
                            transition={{ duration: 2, ease: "circOut" }}
                            className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                        />
                    </div>
                </Card>

                <Card className="relative overflow-hidden bg-surface-2 border border-white/5 group min-h-[160px] flex flex-col p-8 transition-all duration-500 hover:border-emerald-500/30">
                    {/* Centered Decorative Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center flex-1">
                        <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                            <Banknote size={24} />
                        </div>
                        
                        <div className="text-center space-y-1">
                            <div className="flex items-center gap-1.5 justify-center">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] text-emerald-400/80 font-black uppercase tracking-[0.2em]">Liquid Cash</p>
                            </div>
                            <p className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl">
                                <span className="text-emerald-500 mr-0.5">$</span>
                                {user?.cashBalance?.toLocaleString() || 0}
                            </p>
                            <p className="text-[10px] text-muted/60 font-bold uppercase tracking-widest pt-1">Current Assets</p>
                        </div>
                    </div>

                    {/* Flush Bottom Foundation Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, ((user?.cashBalance || 0) / (user?.totalMoney || 1)) * 100)}%` }}
                            transition={{ duration: 2, ease: "circOut" }}
                            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                        />
                    </div>
                </Card>

                <Card className="relative overflow-hidden bg-surface-2 border border-white/5 group min-h-[160px] flex flex-col p-8 transition-all duration-500 hover:border-blue-500/30">
                    {/* Centered Decorative Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center flex-1">
                        <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                            <CreditCard size={24} />
                        </div>
                        
                        <div className="text-center space-y-1">
                            <div className="flex items-center gap-1.5 justify-center">
                                <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                <p className="text-[10px] text-blue-400/80 font-black uppercase tracking-[0.2em]">Treasury / Bank</p>
                            </div>
                            <p className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl">
                                <span className="text-blue-500 mr-0.5">$</span>
                                {user?.creditBalance?.toLocaleString() || 0}
                            </p>
                            <p className="text-[10px] text-muted/60 font-bold uppercase tracking-widest pt-1">Accounting Value</p>
                        </div>
                    </div>

                    {/* Flush Bottom Foundation Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, ((user?.creditBalance || 0) / (user?.totalMoney || 1)) * 100)}%` }}
                            transition={{ duration: 2, ease: "circOut" }}
                            className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                        />
                    </div>
                </Card>
            </div>

            {/* Cashflow Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-8 min-h-[140px] flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ArrowUpCircle size={60} className="text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-black text-muted/60 uppercase tracking-[0.2em] mb-2">Monthly In</p>
                    <p className="text-2xl font-black text-emerald-400 drop-shadow-lg group-hover:scale-105 transition-transform origin-left">
                        +${(Number(user?.monthlyIncome || 0) + dashboardStats.monthlyIncome).toLocaleString()}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500/10" />
                </Card>
                
                <Card className="p-8 min-h-[140px] flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ArrowDownCircle size={60} className="text-red-500" />
                    </div>
                    <p className="text-[10px] font-black text-muted/60 uppercase tracking-[0.2em] mb-2">Monthly Burn</p>
                    <p className="text-2xl font-black text-red-500 drop-shadow-lg group-hover:scale-105 transition-transform origin-left">
                        -${dashboardStats.monthlyExpenses.toLocaleString()}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500/10" />
                </Card>

                <Card className="p-8 min-h-[140px] flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={60} className="text-indigo-500" />
                    </div>
                    <p className="text-[10px] font-black text-muted/60 uppercase tracking-[0.2em] mb-2">Monthly Saved</p>
                    <p className={`text-2xl font-black drop-shadow-lg group-hover:scale-105 transition-transform origin-left ${dashboardStats.netCashflow >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
                        {dashboardStats.netCashflow >= 0 ? '+' : ''}${dashboardStats.netCashflow.toLocaleString()}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500/10" />
                </Card>

                <Card className="p-8 min-h-[140px] flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet size={60} className="text-blue-500" />
                    </div>
                    <p className="text-[10px] font-black text-muted/60 uppercase tracking-[0.2em] mb-2">Invested</p>
                    <p className="text-2xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                        ${dashboardStats.monthlyInvestments.toLocaleString()}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500/10" />
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Receipt size={20} className="text-indigo-400" /> Accounting History
                            </h2>
                            <Button onClick={() => setShowTxModal(true)} className="rounded-full shadow-lg shadow-indigo-500/20">
                                <Plus size={18} className="mr-2" /> Log Transaction
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {transactions.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                                    <DollarSign size={48} className="mx-auto text-muted mb-4 opacity-20" />
                                    <p className="text-muted font-medium">No accounting records found.</p>
                                </div>
                            ) : (
                                transactions.map(tx => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={tx._id}
                                        className="flex justify-between items-center p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all bg-surface hover:bg-surface-2 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${tx.type === 'expense' ? 'bg-red-500/10 text-red-500' :
                                                    tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        'bg-indigo-500/10 text-indigo-400'
                                                }`}>
                                                {tx.type === 'expense' ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase text-sm tracking-tight">{tx.category}</p>
                                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${tx.account === 'credit' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                                                        }`}>
                                                        {tx.account}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-tighter flex items-center gap-2">
                                                    {new Date(tx.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    {tx.fromWho && <span className="text-white/30">• from {tx.fromWho}</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-lg font-black font-mono ${tx.type === 'expense' ? 'text-red-500' :
                                                tx.type === 'income' ? 'text-emerald-400' :
                                                    'text-indigo-400'
                                            }`}>
                                            {tx.type === 'expense' ? '-' : '+'}${tx.amount.toLocaleString()}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-surface relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-black uppercase text-muted tracking-widest">Allocation</h3>
                            <BarChart3 size={16} className="text-muted" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                    <span className="text-emerald-400">Liquid Cash</span>
                                    <span className="text-white">{Math.round((user?.cashBalance / (user?.totalMoney || 1)) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(user?.cashBalance / (user?.totalMoney || 1)) * 100}%` }} className="h-full bg-emerald-500" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                    <span className="text-blue-400">Credit / Bank</span>
                                    <span className="text-white">{Math.round((user?.creditBalance / (user?.totalMoney || 1)) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(user?.creditBalance / (user?.totalMoney || 1)) * 100}%` }} className="h-full bg-blue-500" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-sm font-black uppercase tracking-widest text-muted mb-4">Smart Tips</h3>
                        <ul className="space-y-3">
                            <li className="text-xs text-muted flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                <span>Keep at least 20% of your net worth in Liquid Cash for emergencies.</span>
                            </li>
                            <li className="text-xs text-muted flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                                <span>Log credit card payments as transfers or expenses to keep balances accurate.</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>

            {/* Config Modal */}
            <Modal open={showConfig} title="Master Treasury Setup" onClose={() => setShowConfig(false)}>
                <form onSubmit={handleConfigSave} className="space-y-4">
                    <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 mb-4">
                        <p className="text-[10px] font-black uppercase text-indigo-400 mb-2">Notice</p>
                        <p className="text-xs text-muted">Setting these values directly overwrites your current balances. Use this for initial setup or corrections.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-2">Starting Cash</label>
                            <input
                                type="number"
                                required
                                className="pc-input w-full"
                                value={configData.cashBalance}
                                onChange={e => setConfigData({ ...configData, cashBalance: e.target.value, totalMoney: Number(e.target.value) + Number(configData.creditBalance) })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-2">Starting Credit</label>
                            <input
                                type="number"
                                required
                                className="pc-input w-full"
                                value={configData.creditBalance}
                                onChange={e => setConfigData({ ...configData, creditBalance: e.target.value, totalMoney: Number(configData.cashBalance) + Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2">Total Treasury (Auto-calculated)</label>
                        <input
                            type="number"
                            readOnly
                            className="pc-input w-full bg-white/5 opacity-50"
                            value={configData.totalMoney}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2 text-indigo-400">Total Wealth Target ($)</label>
                        <input
                            type="number"
                            required
                            placeholder="e.g. 50000"
                            className="pc-input w-full border-indigo-500/20 focus:border-indigo-500"
                            value={configData.savingsGoal}
                            onChange={e => setConfigData({ ...configData, savingsGoal: e.target.value })}
                        />
                        <p className="text-[9px] text-muted italic mt-1">This sets the 100% mark for your purple Net Worth bar.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2">Base Monthly Salary</label>
                        <input
                            type="number"
                            required
                            className="pc-input w-full"
                            value={configData.monthlyIncome}
                            onChange={e => setConfigData({ ...configData, monthlyIncome: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowConfig(false)}>Cancel</Button>
                        <Button type="submit">Update Treasury</Button>
                    </div>
                </form>
            </Modal>

            {/* Transaction Modal */}
            <Modal open={showTxModal} title="Log Financial Activity" onClose={() => setShowTxModal(false)}>
                <form onSubmit={handleTransactionSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2">1. Select Account</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'cash', label: 'Cash Balance', icon: Banknote, color: 'emerald' },
                                { id: 'credit', label: 'Credit / Card', icon: CreditCard, color: 'blue' }
                            ].map(acc => (
                                <button
                                    key={acc.id}
                                    type="button"
                                    onClick={() => setTxData({ ...txData, account: acc.id })}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl transition-all border ${txData.account === acc.id
                                            ? `bg-${acc.color}-500 border-${acc.color}-500 text-white shadow-lg shadow-${acc.color}-500/20`
                                            : 'bg-surface-2 border-white/5 text-muted hover:border-white/20'
                                        }`}
                                >
                                    <acc.icon size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{acc.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2">2. Transaction Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['income', 'expense', 'investment'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTxData({ ...txData, type: t })}
                                    className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${txData.type === t
                                            ? 'bg-indigo-500 border-indigo-500 text-white'
                                            : 'bg-surface-2 border-white/5 text-muted hover:border-white/20'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-2">Amount ($)</label>
                            <input
                                type="number"
                                required
                                placeholder="0.00"
                                className="pc-input w-full"
                                value={txData.amount}
                                onChange={e => setTxData({ ...txData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-2">{txData.type === 'income' ? 'Source / From' : 'Target / To'}</label>
                            <input
                                type="text"
                                placeholder="e.g. Salary, Boss, Amazon"
                                className="pc-input w-full"
                                value={txData.fromWho}
                                onChange={e => setTxData({ ...txData, fromWho: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-2">Search Category</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Food, Salary, Gift, Tech..."
                            className="pc-input w-full"
                            value={txData.category}
                            onChange={e => setTxData({ ...txData, category: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowTxModal(false)}>Cancel</Button>
                        <Button type="submit">Complete Log</Button>
                    </div>
                </form>
            </Modal>

            <Confetti 
                active={showConfetti} 
                theme={confettiConfig.theme} 
                variant={confettiConfig.variant} 
                onComplete={() => setShowConfetti(false)} 
            />
        </div>
    );
}
