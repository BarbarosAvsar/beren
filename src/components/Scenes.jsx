import React, { useMemo, memo, useState } from 'react';
import { motion } from 'framer-motion';
const R = Infinity;

// ===== ANIMATED ANIMAL COMPONENTS =====

const BouncingMonkey = () => (
    <motion.div className="text-7xl pointer-events-auto cursor-pointer relative"
        animate={{
            y: [0, -30, 0, -15, 0],
            rotate: [-5, 5, -5, 5, -5],
            scaleY: [1, 0.9, 1.1, 1, 1]
        }}
        transition={{ duration: 4, repeat: R, ease: "easeInOut" }}
        whileTap={{ scale: 1.4, rotate: [0, 20, -20, 0] }}>
        🐒
        <motion.div className="absolute top-0 right-0 text-xl" animate={{ rotate: [0, 40, 0] }} transition={{ duration: 2, repeat: R }}>🍃</motion.div>
    </motion.div>
);

const SwimmingFish = ({ emoji, y, speed, delay, direction = 1 }) => (
    <motion.div className="absolute text-5xl pointer-events-auto cursor-pointer"
        style={{ top: y, scaleX: direction }}
        animate={{
            x: direction === 1 ? ['-20vw', '120vw'] : ['120vw', '-20vw'],
            y: [y, y - 20, y + 20, y]
        }}
        transition={{
            x: { duration: speed, repeat: R, delay, ease: "linear" },
            y: { duration: 3, repeat: R, ease: "easeInOut" }
        }}
        whileTap={{ scale: 2, x: direction === 1 ? 500 : -500, transition: { duration: 0.5 } }}>
        {emoji}
    </motion.div>
);

const FloatingGhost = () => (
    <motion.div className="text-6xl text-white/40 pointer-events-auto cursor-pointer"
        animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
        }}
        transition={{ duration: 5, repeat: R, ease: "easeInOut" }}
        whileTap={{ scale: 0, opacity: 0 }}>
        👻
    </motion.div>
);

// ===== SCENES =====

export const FactoryScene = memo(() => {
    const gears = useMemo(() => [
        { x: '8%', y: '15%', s: 100, d: 10 }, { x: '82%', y: '25%', s: 80, d: -7 }, { x: '45%', y: '55%', s: 130, d: 14 }, { x: '25%', y: '70%', s: 60, d: -5 }
    ], []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c2c] via-[#29366f] to-[#334155]" />
            {gears.map((g, i) =>
                <motion.div key={i} className="absolute border-[8px] border-dashed border-white/5 rounded-full pointer-events-auto cursor-pointer shadow-2xl"
                    whileTap={{ scale: 1.2, rotate: 180 }}
                    style={{ left: g.x, top: g.y, width: g.s, height: g.s }} animate={{ rotate: 360 }}
                    transition={{ duration: Math.abs(g.d), repeat: R, ease: 'linear', direction: g.d > 0 ? 'normal' : 'reverse' }} />)}

            {/* Conveyor Belt */}
            <div className="absolute bottom-12 w-full h-12 bg-slate-800 border-t-4 border-slate-600">
                <motion.div className="w-full h-full" animate={{ backgroundPosition: ['0px 0px', '40px 0px'] }}
                    transition={{ duration: 1, repeat: R, ease: "linear" }}
                    style={{ backgroundImage: 'repeating-linear-gradient(90deg, #1e293b 0, #1e293b 20px, #334155 20px, #334155 40px)', backgroundSize: '40px 100%' }} />
            </div>

            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-400/5 blur-3xl" />
        </div>
    );
});

export const SpaceScene = memo(() => {
    const stars = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
        x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 3 + 2, d: Math.random() * 5
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#050510]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#000000_100%)]" />
            {stars.map((s, i) => (
                <motion.div key={i} className="absolute bg-white rounded-full pointer-events-auto cursor-pointer"
                    style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }} transition={{ duration: 2 + s.d, repeat: R }}
                    whileTap={{ scale: 4, backgroundColor: '#fcd34d' }} />
            ))}
            <motion.div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-amber-600 shadow-[0_0_100px_rgba(239,68,68,0.3)] pointer-events-auto cursor-pointer"
                style={{ right: '10%', top: '15%' }} animate={{ y: [0, -20, 0], rotate: 360 }} transition={{ duration: 20, repeat: R, ease: "linear" }}
                whileTap={{ scale: 1.2 }} />
        </div>
    );
});

export const UnderwaterScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#0ea5e9] to-[#1e3a8a]">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1%, transparent 1%)', backgroundSize: '100px 100px' }} />

        <SwimmingFish emoji="🐟" y="25%" speed={12} delay={0} />
        <SwimmingFish emoji="🐠" y="50%" speed={16} delay={4} direction={-1} />
        <SwimmingFish emoji="🐡" y="70%" speed={20} delay={2} />

        <motion.div className="absolute text-7xl pointer-events-auto cursor-pointer" style={{ bottom: '20%', left: '15%' }}
            animate={{ x: [0, 50, 0], y: [0, -10, 0], rotate: [-5, 5, -5] }} transition={{ duration: 8, repeat: R }}
            whileTap={{ scale: 1.3 }}>🐢</motion.div>

        {/* Rising Bubbles */}
        {Array.from({ length: 15 }).map((_, i) => (
            <motion.div key={i} className="absolute rounded-full border-2 border-white/20 bg-white/5 pointer-events-auto cursor-pointer"
                style={{ width: 20 + Math.random() * 20, height: 20 + Math.random() * 20, left: `${Math.random() * 100}%`, bottom: '-10%' }}
                animate={{ y: '-120vh', x: [0, (Math.random() - 0.5) * 100] }}
                transition={{ duration: 5 + Math.random() * 5, repeat: R, delay: Math.random() * 5, ease: "linear" }}
                whileTap={{ scale: 0, opacity: 0 }} />
        ))}
    </div>
));

export const JungleScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#065f46] via-[#059669] to-[#064e3b]">
        <div className="absolute inset-0 opacity-10" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 80px, white 80px, white 85px)' }} />

        <div className="absolute left-[10%] top-[30%]">
            <BouncingMonkey />
        </div>

        <motion.div className="absolute text-6xl pointer-events-auto cursor-pointer" style={{ right: '15%', top: '20%' }}
            animate={{ y: [0, -15, 0], rotate: [-10, 10, -10] }} transition={{ duration: 4, repeat: R }}
            whileTap={{ scale: 1.5, rotate: 360 }}>🦜</motion.div>

        <motion.div className="absolute text-8xl opacity-20" style={{ bottom: '10%', left: '60%' }}
            animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }} transition={{ duration: 6, repeat: R }}>🌳</motion.div>
    </div>
));

export const DiscoScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
        <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-60 h-60 rounded-full bg-gradient-to-br from-slate-400 to-slate-800 border-4 border-slate-500 shadow-[0_0_80px_rgba(255,255,255,0.2)] animate-pulse" />

        {/* Floor tiles */}
        <div className="absolute bottom-0 w-full h-[30%] grid grid-cols-8 grid-rows-3 gap-1 px-4 pb-4">
            {Array.from({ length: 24 }).map((_, i) => (
                <motion.div key={i} className="rounded-md shadow-inner"
                    animate={{ backgroundColor: ['#1e293b', '#ec4899', '#3b82f6', '#eab308', '#1e293b'] }}
                    transition={{ duration: 2, repeat: R, delay: Math.random() * 2 }} />
            ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <motion.div className="w-[80vw] h-[80vw] rounded-full border-[40px] border-white/10" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: R }} />
        </div>
    </div>
));

export const HauntedScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black" />

        <div className="absolute left-[20%] top-[40%]">
            <FloatingGhost />
        </div>

        <motion.div className="absolute text-5xl pointer-events-auto cursor-pointer" style={{ right: '25%', top: '30%' }}
            animate={{ x: [0, -30, 30, 0], y: [0, 20, -20, 0] }} transition={{ duration: 6, repeat: R }}
            whileTap={{ scale: 0 }}>🦇</motion.div>

        <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-t from-black to-transparent" />
    </div>
));

export const MoonScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#111827]">
        <div className="absolute w-40 h-40 rounded-full bg-[#f3f4f6] shadow-[0_0_100px_rgba(255,255,255,0.2)]" style={{ right: '15%', top: '15%' }} />
        <div className="absolute bottom-0 w-full h-[25%] bg-[#9ca3af] rounded-t-[100%]" />
        <motion.div className="absolute text-4xl" style={{ bottom: '15%', left: '40%' }} animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: R }}>🛸</motion.div>
    </div>
));

export const MarsScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#450a0a]">
        <div className="absolute bottom-0 w-full h-[30%] bg-[#7f1d1d] rounded-t-[50%]" />
        {Array.from({ length: 10 }).map((_, i) => (
            <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-orange-400"
                style={{ left: `${Math.random() * 100}%`, bottom: '10%' }}
                animate={{ y: [-20, -100], opacity: [1, 0] }} transition={{ duration: 3, repeat: R, delay: i * 0.5 }} />
        ))}
        <motion.div className="absolute text-5xl" style={{ bottom: '20%', right: '30%' }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: R }}>☄️</motion.div>
    </div>
));

export const CandyScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#fdf2f8]">
        {['🍭', '🍬', '🍩', '🍪'].map((e, i) => (
            <motion.div key={i} className="absolute text-6xl pointer-events-auto cursor-pointer"
                style={{ left: `${20 + i * 20}%`, top: `${30 + i * 10}%` }}
                animate={{ y: [0, -20, 0], rotate: [-10, 10, -10] }} transition={{ duration: 3, repeat: R, delay: i * 0.4 }}
                whileTap={{ scale: 1.5, rotate: 360 }}>
                {e}
            </motion.div>
        ))}
        <div className="absolute bottom-0 w-full h-[20%] bg-[#fce7f3] rounded-t-[100%]" />
    </div>
));

export const VolcanoScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#450a0a]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[300px] border-r-[300px] border-b-[200px] border-transparent border-b-[#1c1917]" />
        {Array.from({ length: 20 }).map((_, i) => (
            <motion.div key={i} className="absolute w-3 h-3 rounded-full bg-orange-500"
                style={{ left: '50%', bottom: '180px' }}
                animate={{ y: -300, x: (Math.random() - 0.5) * 300, scale: [1, 0.5], opacity: [1, 0] }}
                transition={{ duration: 2, repeat: R, delay: Math.random() * 2 }} />
        ))}
    </div>
));

export const ArcticScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#f1f5f9]">
        {Array.from({ length: 30 }).map((_, i) => (
            <motion.div key={i} className="absolute w-2 h-2 bg-white rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: '-10px' }}
                animate={{ y: '110vh', x: (Math.random() - 0.5) * 50 }}
                transition={{ duration: 5 + Math.random() * 5, repeat: R, delay: Math.random() * 5, ease: "linear" }} />
        ))}
        <motion.div className="absolute text-6xl" style={{ bottom: '10%', left: '40%' }}
            animate={{ x: [0, 30, 0], y: [0, -10, 0] }} transition={{ duration: 6, repeat: R }}>🐧</motion.div>
    </div>
));

export const SunsetScene = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#f97316] via-[#e11d48] to-[#4c1d95]">
        <motion.div className="absolute w-40 h-40 rounded-full bg-[#fef08a] shadow-[0_0_100px_#fef08a]"
            style={{ left: '50%', bottom: '20%', marginLeft: -80 }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 5, repeat: R }} />
        <div className="absolute bottom-0 w-full h-[15%] bg-black/20" />
    </div>
));

const Scenes = {
    Factory: FactoryScene, Space: SpaceScene, Moon: MoonScene, Jungle: JungleScene, Mars: MarsScene,
    Underwater: UnderwaterScene, Candy: CandyScene, Volcano: VolcanoScene, Arctic: ArcticScene, Sunset: SunsetScene, Haunted: HauntedScene, Disco: DiscoScene
};

export default Scenes;
