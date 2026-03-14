import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import './Pricing.css';

const FEATURES = [
    { label: 'Daily Progress Circle', free: true, premium: true },
    { label: 'Task Management', free: 'Basic', premium: 'Advanced' },
    { label: 'Streak Tracking', free: 'Basic', premium: 'Advanced analytics' },
    { label: 'Habit Tracking', free: '5 habits max', premium: 'Unlimited habits' },
    { label: 'Habit Categories', free: false, premium: true },
    { label: 'Progress Statistics', free: 'Basic', premium: 'Detailed charts' },
    { label: 'Reminders', free: false, premium: 'Smart reminders' },
    { label: 'Data Export (CSV/PDF)', free: false, premium: true },
    { label: 'Themes / Customization', free: false, premium: true },
    { label: 'AI Habit Insights', free: false, premium: true },
    { label: 'Premium Profile Badge', free: false, premium: true },
    { label: 'Priority Support', free: false, premium: true },
    { label: 'Ads', free: 'Google AdSense ads', premium: 'No ads' },
];

const FeatureValue = ({ value, isPremium }) => {
    if (value === true) return <span className="feat-check">✓</span>;
    if (value === false) return <span className="feat-cross">✕</span>;
    return <span className={`feat-text ${isPremium ? 'feat-premium' : 'feat-free'}`}>{value}</span>;
};

export default function Pricing() {
    const [cycle, setCycle] = useState('monthly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [loadingPromo, setLoadingPromo] = useState(false);
    const [promoMessage, setPromoMessage] = useState('');
    const { user } = useAuth();
    const token = localStorage.getItem('token'); // or from auth context if provided there
    const navigate = useNavigate();

    const monthlyPrice = 149;
    const yearlyPrice = 1299;
    const yearlyPerMonth = (yearlyPrice / 12).toFixed(0);
    const savings = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

    const handleUpgrade = async () => {
        if (!user) { navigate('/login'); return; }
        setLoading(true);
        setError('');
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/subscription/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ billingCycle: cycle }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Failed to initiate payment.');
            window.location.href = data.iframeUrl;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm('Are you sure you want to cancel your Premium subscription? You will lose access to premium features at the end of your billing cycle.')) {
            return;
        }
        
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/subscription/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Failed to cancel subscription.');
            
            toast.success(data.message);
            // Optionally reload page to refresh user object from backend
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleRedeemPromo = async () => {
        if (!promoCode) return;
        setLoadingPromo(true);
        setPromoMessage('');
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/users/redeem-promo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ code: promoCode }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Failed to redeem promo code');
            setPromoMessage(data.message);
            toast.success(data.message);
            setTimeout(() => window.location.reload(), 1500); 
        } catch (err) {
            setPromoMessage(err.message);
            toast.error(err.message);
        } finally {
            setLoadingPromo(false);
        }
    };

    return (
        <div className="pricing-page">
            <div className="pricing-hero">
                <span className="pricing-badge">💎 Go Premium</span>
                <h1>Unlock Your Full Potential</h1>
                <p>Choose the plan that powers your productivity journey.</p>

                <div className="billing-toggle">
                    <button
                        className={cycle === 'monthly' ? 'active' : ''}
                        onClick={() => setCycle('monthly')}
                    >Monthly</button>
                    <button
                        className={cycle === 'yearly' ? 'active' : ''}
                        onClick={() => setCycle('yearly')}
                    >
                        Yearly
                        <span className="savings-chip">Save {savings}%</span>
                    </button>
                </div>
            </div>

            <div className="pricing-cards">
                {/* Free Card */}
                <div className="pricing-card free-card">
                    <div className="card-header">
                        <span className="plan-icon">🌱</span>
                        <h2>Free</h2>
                        <p className="plan-desc">Great for getting started</p>
                    </div>
                    <div className="price-display">
                        <span className="price-amount">0</span>
                        <span className="price-currency">EGP</span>
                        <span className="price-period">/ forever</span>
                    </div>
                    <button className="cta-btn free-btn" onClick={() => navigate('/dashboard')}>
                        Get Started Free
                    </button>
                    <ul className="feature-list">
                        {FEATURES.map((f) => (
                            <li key={f.label} className={!f.free ? 'feat-unavailable' : ''}>
                                <FeatureValue value={f.free} isPremium={false} />
                                <span className="feat-label">{f.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Premium Card */}
                <div className="pricing-card premium-card">
                    <div className="popular-badge">Most Popular</div>
                    <div className="card-header">
                        <span className="plan-icon">⭐</span>
                        <h2>Premium</h2>
                        <p className="plan-desc">For serious achievers</p>
                    </div>
                    <div className="price-display">
                        <span className="price-amount">
                            {cycle === 'monthly' ? monthlyPrice : yearlyPerMonth}
                        </span>
                        <span className="price-currency">EGP</span>
                        <span className="price-period">/ month</span>
                    </div>
                    {cycle === 'yearly' && (
                        <p className="yearly-note">Billed annually ({yearlyPrice} EGP/year)</p>
                    )}

                    {user?.plan === 'premium' ? (
                        <div className="premium-active-state">
                            <div className="premium-badge-large">
                                💎 {user?.subscription?.status === 'cancelled' ? 'Cancelled Subscription' : 'Active Subscription'}
                            </div>
                            
                            {user?.subscription && (user.subscription.status === 'active' || user.subscription.status === 'cancelled') ? (
                                <div className="subscription-details">
                                    <p>
                                        {user.subscription.status === 'cancelled' 
                                            ? 'Your subscription is cancelled but remains active until the end of the billing period.' 
                                            : 'Your subscription is active.'}
                                    </p>
                                    {user.subscription.currentPeriodEnd && (
                                        <p className="renewal-date">
                                            {user.subscription.status === 'cancelled' ? 'Ends on:' : 'Renews on:'} <strong>{new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}</strong>
                                        </p>
                                    )}
                                    {user.subscription.status === 'active' && (
                                        <button 
                                            className="cancel-btn" 
                                            onClick={handleCancelSubscription}
                                        >
                                            Cancel Subscription
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="subscription-details">
                                    <p>You have lifetime premium access.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                className="cta-btn premium-btn"
                                onClick={handleUpgrade}
                                disabled={loading}
                            >
                                {loading ? 'Redirecting…' : `Upgrade via PayMob`}
                            </button>
                            <p className="payment-note">🔒 Secure payment via PayMob · Cancel anytime</p>
                        </>
                    )}

                    <ul className="feature-list">
                        {FEATURES.map((f) => (
                            <li key={f.label}>
                                <FeatureValue value={f.premium} isPremium={true} />
                                <span className="feat-label">{f.label}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Promo Code Redemption Section */}
                    {user && user.plan !== 'premium' && (
                        <div className="promo-code-section mt-6 p-4 border border-indigo-500/20 rounded-xl bg-indigo-500/5">
                            <h4 className="text-sm font-black text-indigo-400 mb-2 uppercase tracking-widest text-center">Have a Promo Code?</h4>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter Code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none uppercase"
                                />
                                <button
                                    onClick={handleRedeemPromo}
                                    disabled={!promoCode || loadingPromo}
                                    className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-lg text-sm hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                                >
                                    {loadingPromo ? '...' : 'Redeem'}
                                </button>
                            </div>
                            {promoMessage && (
                                <p className={`text-xs text-center mt-2 ${promoMessage.includes('Wait') || promoMessage.includes('Invalid') || promoMessage.includes('expired') || promoMessage.includes('usage') || promoMessage.includes('already') ? 'text-red-400' : 'text-green-400'}`}>
                                    {promoMessage}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="pricing-footer">
                <p>🔒 Payments processed securely by <strong>PayMob</strong> · No credit card stored on our servers</p>
            </div>
        </div>
    );
}
