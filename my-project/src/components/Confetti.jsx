import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Confetti Component - Optimized for performance and high-quality "Wow" factor.
 * Uses Framer Motion for smooth, hardware-accelerated animations.
 * 
 * @param {boolean} active - Triggers the animation
 * @param {boolean} isBigTask - If true, launches a larger "Victory" burst
 * @param {function} onComplete - Callback when animation finishes
 */
export function Confetti({ active, isBigTask = false, onComplete }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (active) {
            const count = isBigTask ? 80 : 40;
            const newParticles = Array.from({ length: count }).map((_, idx) => ({
                id: Math.random().toString(36).substr(2, 9),
                x: Math.random() * 100,
                y: -20,
                size: isBigTask ? (Math.random() * 12 + 6) : (Math.random() * 8 + 4),
                // Premium color palette: Indigo, Violet, Emerald, Amber, Rose
                color: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'][Math.floor(Math.random() * 5)],
                delay: Math.random() * (isBigTask ? 0.8 : 0.4),
                duration: Math.random() * 2 + (isBigTask ? 1.5 : 1),
                rotation: Math.random() * 720,
                shape: Math.floor(Math.random() * 3) // 0: circle, 1: square, 2: rectangle
            }));
            
            setParticles(newParticles);

            const timer = setTimeout(() => {
                setParticles([]);
                if (onComplete) onComplete();
            }, isBigTask ? 5000 : 3000);
            
            return () => clearTimeout(timer);
        }
    }, [active, isBigTask, onComplete]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ 
                            y: '110vh', 
                            x: `${p.x}vw`, 
                            opacity: 1, 
                            rotate: 0,
                            scale: 0 
                        }}
                        animate={{
                            y: '-20vh',
                            x: `${p.x + (Math.random() * 40 - 20)}vw`,
                            opacity: [1, 1, 0.5, 0],
                            rotate: p.rotation + 1440,
                            scale: [0, 1.2, 1, 0.5]
                        }}
                        transition={{
                            duration: p.duration,
                            delay: p.delay,
                            ease: "circOut"
                        }}
                        style={{
                            position: 'absolute',
                            width: p.size,
                            height: p.shape === 2 ? p.size * 0.4 : p.size,
                            backgroundColor: p.color,
                            borderRadius: p.shape === 0 ? '50%' : '2px',
                            boxShadow: `0 0 10px ${p.color}40`,
                            filter: isBigTask ? 'blur(0.5px)' : 'none'
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
