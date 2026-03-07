import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Confetti({ active, onComplete }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (active) {
            const newParticles = Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10,
                size: Math.random() * 8 + 4,
                color: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'][Math.floor(Math.random() * 5)],
                delay: Math.random() * 0.5,
                duration: Math.random() * 2 + 1,
                rotation: Math.random() * 360,
            }));
            setParticles(newParticles);

            const timer = setTimeout(() => {
                setParticles([]);
                if (onComplete) onComplete();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [active, onComplete]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ y: '100vh', x: `${p.x}vw`, opacity: 1, rotate: 0 }}
                        animate={{
                            y: '-10vh',
                            x: `${p.x + (Math.random() * 20 - 10)}vw`,
                            opacity: 0,
                            rotate: p.rotation + 720
                        }}
                        transition={{
                            duration: p.duration,
                            delay: p.delay,
                            ease: "easeOut"
                        }}
                        style={{
                            position: 'absolute',
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            borderRadius: i % 2 === 0 ? '50%' : '2px',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
