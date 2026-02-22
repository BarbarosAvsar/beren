import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ===== Sparkle Trail Component =====
// Creates sparkles that follow mouse/touch for toddler engagement

const SparkleTrail = () => {
    const [sparkles, setSparkles] = useState([]);

    const addSparkle = useCallback((x, y) => {
        const id = Date.now() + Math.random();
        const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#7CFC00', '#BA55D3', '#FF4500'];
        const shapes = ['circle', 'star', 'heart'];
        setSparkles(prev => [...prev.slice(-15), {
            id,
            x,
            y,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            size: 8 + Math.random() * 16,
            rotation: Math.random() * 360,
        }]);
    }, []);

    useEffect(() => {
        const handleMove = (e) => {
            const x = e.clientX || (e.touches && e.touches[0]?.clientX);
            const y = e.clientY || (e.touches && e.touches[0]?.clientY);
            if (x !== undefined && y !== undefined) addSparkle(x, y);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
        };
    }, [addSparkle]);

    // Auto-cleanup old sparkles
    useEffect(() => {
        const timer = setInterval(() => {
            setSparkles(prev => prev.filter(s => Date.now() - s.id < 800));
        }, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[90]">
            <AnimatePresence>
                {sparkles.map(s => (
                    <motion.div
                        key={s.id}
                        className="absolute"
                        style={{ left: s.x - s.size / 2, top: s.y - s.size / 2 }}
                        initial={{ scale: 1, opacity: 1, rotate: s.rotation }}
                        animate={{ scale: 0, opacity: 0, y: -30, rotate: s.rotation + 180 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {s.shape === 'circle' && (
                            <div className="rounded-full shadow-lg" style={{ width: s.size, height: s.size, backgroundColor: s.color, boxShadow: `0 0 ${s.size}px ${s.color}` }} />
                        )}
                        {s.shape === 'star' && (
                            <div style={{ fontSize: s.size, color: s.color, lineHeight: 1, textShadow: `0 0 ${s.size / 2}px ${s.color}` }}>★</div>
                        )}
                        {s.shape === 'heart' && (
                            <div style={{ fontSize: s.size, color: s.color, lineHeight: 1, textShadow: `0 0 ${s.size / 2}px ${s.color}` }}>♥</div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default SparkleTrail;
