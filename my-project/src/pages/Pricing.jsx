import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pricing.css';

const FEATURES = [
    { label: 'Daily Progress Circle', free: true, premium: true },
    { label: 'Task Management', free: 'Basic', premium: 'Advanced' },
    { label: 'Streak Tracking', free: 'Basic', premium: 'Advanced analytics' },
    { label: 'Habit Tracking', free: 'Up to 5 habits', premium: 'Unlimited habits' },
    { label: 'Habit Categories', free: false, premium: true },
    { label: 'Progress Statistics', free: 'Limited', premium: 'Detailed charts' },
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
            const res = await fetch('/api/subscription/create-order', {
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

                    {error && <p className="payment-error">{error}</p>}

                    <button
                        className="cta-btn premium-btn"
                        onClick={handleUpgrade}
                        disabled={loading || user?.plan === 'premium'}
                    >
                        {loading ? 'Redirecting…' : user?.plan === 'premium' ? '✓ Already Premium' : `Upgrade via PayMob`}
                    </button>
                    <p className="payment-note">🔒 Secure payment via PayMob · Cancel anytime</p>

                    <ul className="feature-list">
                        {FEATURES.map((f) => (
                            <li key={f.label}>
                                <FeatureValue value={f.premium} isPremium={true} />
                                <span className="feat-label">{f.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="pricing-footer">
                <p>🔒 Payments processed securely by <strong>PayMob</strong> · No credit card stored on our servers</p>
            </div>
        </div>
    );
}
