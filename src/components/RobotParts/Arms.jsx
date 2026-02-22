import React from 'react';
import { motion } from 'framer-motion';
const R = Infinity;

// Each arm: { onClick, left }
// Arms attach at vertical center of body, close to body edge

export default [
    // 1 Robot Arm - segmented mechanical
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -28 }}
                whileTap={{ scale: .9 }}>
                <motion.div className="origin-top-left" animate={{ rotate: [0, 12, 0, -8, 0] }} transition={{ duration: 3, repeat: R, ease: 'easeInOut' }}>
                    <div className="w-5 h-7 bg-gray-500 rounded-sm border border-gray-600" />
                    <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto -my-1 relative z-10 border border-gray-500" />
                    <div className="w-4 h-8 bg-gray-600 rounded-sm ml-0.5" />
                    <div className="w-5 h-3 bg-gray-400 rounded-md" />
                </motion.div>
            </motion.div>
        )
    },
    // 2 Claw
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -28 }}
                whileTap={{ scale: .9 }}>
                <motion.div animate={{ rotate: [0, 8, -5, 0] }} transition={{ duration: 2.5, repeat: R, ease: 'easeInOut' }}>
                    <div className="w-4 h-10 bg-red-700 rounded-sm" />
                    <motion.div className="flex origin-top" animate={{ gap: ['2px', '6px', '2px'] }} transition={{ duration: 1.5, repeat: R }}>
                        <div className="w-2 h-5 bg-red-600 rounded-b-md" style={{ transform: 'rotate(-10deg)' }} />
                        <div className="w-2 h-5 bg-red-600 rounded-b-md" style={{ transform: 'rotate(10deg)' }} />
                    </motion.div>
                </motion.div>
            </motion.div>
        )
    },
    // 3 Drill
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -30 }}
                whileTap={{ scale: .9 }}>
                <motion.div animate={{ rotate: [0, 6, -4, 0] }} transition={{ duration: 3, repeat: R, ease: 'easeInOut' }}>
                    <div className="w-5 h-8 bg-yellow-600 rounded-sm" />
                    <motion.div className="ml-0.5" animate={{ rotate: 360 }} transition={{ duration: .3, repeat: R, ease: 'linear' }}>
                        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[14px] border-transparent border-t-gray-400" style={{ borderRadius: '0 0 4px 4px' }} />
                    </motion.div>
                </motion.div>
            </motion.div>
        )
    },
    // 4 Sword
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -26 }}
                whileTap={{ scale: .9 }}>
                <motion.div animate={{ rotate: [-5, 15, -5] }} transition={{ duration: 2, repeat: R, ease: 'easeInOut' }}>
                    <div className="w-4 h-6 bg-gray-500 rounded-sm" />
                    <div className="w-1.5 h-3 bg-amber-800 mx-auto" />
                    <div className="w-6 h-1 bg-amber-700 rounded" />
                    <div className="w-2 h-12 bg-gradient-to-b from-gray-300 to-gray-400 mx-auto rounded-b-sm" />
                </motion.div>
            </motion.div>
        )
    },
    // 5 Wing
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -35 }}
                whileTap={{ scale: .9 }}>
                <motion.div className="origin-top-right" animate={{ rotate: [-15, 10, -15] }} transition={{ duration: 1.2, repeat: R, ease: 'easeInOut' }}>
                    <svg width="45" height="60" viewBox="0 0 45 60">
                        <ellipse cx="35" cy="15" rx="12" ry="5" fill="#60A5FA" transform="rotate(-30 35 15)" />
                        <ellipse cx="30" cy="25" rx="14" ry="5" fill="#3B82F6" transform="rotate(-20 30 25)" />
                        <ellipse cx="25" cy="35" rx="16" ry="5" fill="#2563EB" transform="rotate(-10 25 35)" />
                        <ellipse cx="22" cy="45" rx="18" ry="6" fill="#1D4ED8" />
                    </svg>
                </motion.div>
            </motion.div>
        )
    },
    // 6 Tentacle
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -24 }}
                whileTap={{ scale: .9 }}>
                <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 2, repeat: R, ease: 'easeInOut' }}>
                    <svg width="30" height="50" viewBox="0 0 30 50">
                        <motion.path d="M15,0 Q25,12 10,20 Q0,28 15,35 Q25,42 12,50" stroke="#8B5CF6" strokeWidth="6" fill="none" strokeLinecap="round"
                            animate={{ d: ["M15,0 Q25,12 10,20 Q0,28 15,35 Q25,42 12,50", "M15,0 Q5,12 20,20 Q30,28 15,35 Q5,42 18,50", "M15,0 Q25,12 10,20 Q0,28 15,35 Q25,42 12,50"] }}
                            transition={{ duration: 2, repeat: R }} />
                    </svg>
                </motion.div>
            </motion.div>
        )
    },
    // 7 Boxing Glove
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -30 }}
                whileTap={{ scale: .9 }}>
                <div className="w-3 h-8 bg-gray-500 rounded-sm" />
                <motion.div className="w-10 h-8 bg-red-500 rounded-lg rounded-r-2xl border-2 border-red-700 -ml-1"
                    animate={{ x: [0, 5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: R, ease: 'easeInOut' }} />
            </motion.div>
        )
    },
    // 8 Magic Wand
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -28 }}
                whileTap={{ scale: .9 }}>
                <motion.div animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 2, repeat: R, ease: 'easeInOut' }}>
                    <div className="w-3 h-6 bg-gray-500 rounded-sm" />
                    <div className="w-1.5 h-12 bg-gradient-to-b from-amber-900 to-amber-700 mx-auto" />
                    <motion.div className="text-xl -mt-2 ml-[-4px]" animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }} transition={{ duration: .8, repeat: R }}>✨</motion.div>
                </motion.div>
            </motion.div>
        )
    },
    // 9 Hook
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -26 }}
                whileTap={{ scale: .9 }}>
                <motion.div animate={{ rotate: [0, 6, -4, 0] }} transition={{ duration: 3, repeat: R, ease: 'easeInOut' }}>
                    <div className="w-4 h-8 bg-gray-500 rounded-sm" />
                    <svg width="20" height="24" viewBox="0 0 20 24">
                        <path d="M10,0 L10,10 Q10,20 4,20 Q-2,20 2,14" stroke="#D4A017" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                </motion.div>
            </motion.div>
        )
    },
    // 10 Cannon
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -34 }}
                whileTap={{ scale: .9 }}>
                <motion.div animate={{ rotate: [0, 5, -3, 0] }} transition={{ duration: 3, repeat: R, ease: 'easeInOut' }}>
                    <div className="w-5 h-6 bg-gray-600 rounded-sm" />
                    <div className="w-7 h-10 bg-gray-700 rounded-md -ml-1" />
                    <motion.div className="w-4 h-4 rounded-full bg-cyan-400 mx-auto -mt-1" style={{ boxShadow: '0 0 10px #22d3ee' }}
                        animate={{ scale: [.5, 1, .5], opacity: [.4, 1, .4] }} transition={{ duration: 1, repeat: R }} />
                </motion.div>
            </motion.div>
        )
    },
    // 11 Paintbrush
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -28 }}
                whileTap={{ scale: .9 }}>
                <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 2, repeat: R, ease: 'easeInOut' }}>
                    <div className="w-3 h-6 bg-gray-400 rounded-sm" />
                    <div className="w-2 h-10 bg-amber-700 mx-auto rounded-sm" />
                    <div className="w-4 h-3 bg-pink-400 rounded-b-md mx-auto -mt-0.5" />
                    <motion.div className="w-1.5 h-3 bg-pink-400 rounded-b-full mx-auto" animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 2, repeat: R }} />
                </motion.div>
            </motion.div>
        )
    },
    // 12 Shield Arm
    ({ onClick, left }) => {
        const s = left ? -1 : 1; return (
            <motion.div onClick={onClick} className="cursor-pointer absolute z-[25]"
                style={{ top: '50%', transform: `translateY(-50%) scaleX(${s})`, [left ? 'left' : 'right']: -32 }}
                whileTap={{ scale: .9 }}>
                <motion.div animate={{ rotate: [0, 5, -3, 0] }} transition={{ duration: 2.5, repeat: R, ease: 'easeInOut' }}>
                    <div className="w-3 h-6 bg-gray-500 rounded-sm" />
                    <div className="w-12 h-14 rounded-full border-4 border-amber-600 bg-blue-600 flex items-center justify-center -ml-2">
                        <div className="text-lg">⚔️</div>
                    </div>
                </motion.div>
            </motion.div>
        )
    },
].map(c => React.memo(c));
