import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Plus, DollarSign, Settings } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { toast } from 'sonner';

export function Savings() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Config state
    const [showConfig, setShowConfig] = useState(false);
    const [configData, setConfigData] = useState({ totalMoney: user?.totalMoney || 0, monthlyIncome: user?.monthlyIncome || 0 });

    // Transaction state
    const [showTxModal, setShowTxModal] = useState(false);
    const [txData, setTxData] = useState({ type: 'expense', amount: '', category: '', description: '' });

    const fetchTransactions = async () => {
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

    const handleConfigSave = async (e) => {
        e.preventDefault();
        try {
            await api.put('/savings/config', {
                totalMoney: Number(configData.totalMoney),
                monthlyIncome: Number(configData.monthlyIncome)
            });
            toast.success('Financial configuration saved! Reloading to update context...');
            setShowConfig(false);
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save configuration');
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/savings', {
                ...txData,
                amount: Number(txData.amount)
            });
            toast.success('Transaction logged!');
            setShowTxModal(false);
            setTxData({ type: 'expense', amount: '', category: '', description: '' });
            fetchTransactions();
            // Optionally reload to update user context's totalMoney
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to log transaction');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>Financial Tracking</h1>
                    <p className="text-sm text-muted">Manage your expenses and investments.</p>
                </div>
                <Button variant="secondary" onClick={() => setShowConfig(true)}>
                    <Settings size={16} className="mr-2" /> Settings
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted">Total Money</p>
                            <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>${user?.totalMoney || 0}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted">Monthly Income</p>
                            <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>${user?.monthlyIncome || 0}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Recent Transactions</h2>
                    <Button onClick={() => setShowTxModal(true)}>
                        <Plus size={16} className="mr-2" /> Add Log
                    </Button>
                </div>

                <div className="space-y-3">
                    {transactions.length === 0 ? (
                        <p className="text-sm text-muted text-center py-6">No transactions logged yet.</p>
                    ) : (
                        transactions.map(tx => (
                            <div key={tx._id} className="flex justify-between items-center py-3 px-4 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${tx.type === 'expense' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                        {tx.type === 'expense' ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{tx.category}</p>
                                        <p className="text-xs text-muted">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className={`font-bold ${tx.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                                    {tx.type === 'expense' ? '-' : '+'}${tx.amount}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* Config Modal */}
            <AnimatePresence>
                {showConfig && (
                    <Modal title="Financial Settings" onClose={() => setShowConfig(false)}>
                        <form onSubmit={handleConfigSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Total Money</label>
                                <input
                                    type="number"
                                    required
                                    className="pc-input w-full"
                                    value={configData.totalMoney}
                                    onChange={e => setConfigData({ ...configData, totalMoney: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Monthly Income</label>
                                <input
                                    type="number"
                                    required
                                    className="pc-input w-full"
                                    value={configData.monthlyIncome}
                                    onChange={e => setConfigData({ ...configData, monthlyIncome: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="secondary" onClick={() => setShowConfig(false)}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

            {/* Transaction Modal */}
            <AnimatePresence>
                {showTxModal && (
                    <Modal title="Log Transaction" onClose={() => setShowTxModal(false)}>
                        <form onSubmit={handleTransactionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    className="pc-input w-full"
                                    value={txData.type}
                                    onChange={e => setTxData({ ...txData, type: e.target.value })}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="investment">Investment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount</label>
                                <input
                                    type="number"
                                    required
                                    className="pc-input w-full"
                                    value={txData.amount}
                                    onChange={e => setTxData({ ...txData, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category / On What?</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Groceries, Stocks"
                                    className="pc-input w-full"
                                    value={txData.category}
                                    onChange={e => setTxData({ ...txData, category: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="secondary" onClick={() => setShowTxModal(false)}>Cancel</Button>
                                <Button type="submit">Log Transaction</Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}
