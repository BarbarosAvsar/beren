import React from 'react';
import { motion } from 'framer-motion';
const R = Infinity;
const W = ({ onClick, children, className = '', style = {} }) => (
    <motion.div onClick={onClick} className={`relative flex items-center justify-center cursor-pointer ${className}`}
        style={style} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>{children}</motion.div>
);
const Blink = ({ s = 5, c = 'white', d = 0 }) => (
    <motion.div className={`rounded-full border-2 border-black/30 flex items-center justify-center`}
        style={{ width: s * 4, height: s * 4, background: c }}
        animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 0.2, repeat: R, repeatDelay: 3 + d }}>
        <div className="w-2 h-2 bg-black rounded-full" />
    </motion.div>
);
export default [
    // 1 Classic Square - gray, antenna, blinking eyes
    ({ onClick }) => <W onClick={onClick} className="w-[88px] h-[72px] rounded-xl shadow-lg" style={{ background: '#6B7280' }}>
        <div className="absolute -top-5 flex flex-col items-center"><div className="w-0.5 h-4 bg-gray-400" />
            <motion.div className="w-3 h-3 rounded-full bg-red-500" animate={{ opacity: [.3, 1, .3] }} transition={{ duration: .8, repeat: R }} /></div>
        <div className="flex gap-3"><Blink /><Blink d={1} /></div>
        <motion.div className="absolute bottom-2 w-8 h-1 bg-black/30 rounded" animate={{ scaleX: [1, .5, 1] }} transition={{ duration: 2, repeat: R }} />
    </W>,
    // 2 Round Dome - blue dome, visor strip
    ({ onClick }) => <W onClick={onClick} className="w-[90px] h-[80px] rounded-full shadow-lg" style={{ background: '#3B82F6' }}>
        <motion.div className="w-16 h-5 rounded-full bg-cyan-300 border-2 border-cyan-600" style={{ boxShadow: '0 0 12px rgba(103,232,249,.6)' }}
            animate={{ opacity: [.6, 1, .6] }} transition={{ duration: 2, repeat: R }} />
        <div className="absolute bottom-2 w-10 h-2 bg-blue-800 rounded" />
    </W>,
    // 3 Monitor - screen with animated waveform
    ({ onClick }) => <W onClick={onClick} className="w-[96px] h-[72px] rounded-lg shadow-lg" style={{ background: '#1F2937' }}>
        <div className="w-20 h-12 bg-black rounded border-2 border-gray-600 overflow-hidden flex items-center justify-center">
            <motion.div className="w-16 h-0.5 bg-green-400" animate={{ scaleX: [.3, 1, .5, .8, .3], y: [-8, 8, -4, 6, -8] }} transition={{ duration: 2, repeat: R }} />
        </div>
        <div className="absolute bottom-1 w-4 h-1 bg-gray-500 rounded" />
    </W>,
    // 4 Cyclops - green, one huge eye
    ({ onClick }) => <W onClick={onClick} className="w-[80px] h-[80px] rounded-full shadow-lg" style={{ background: '#22C55E' }}>
        <div className="w-14 h-14 bg-white rounded-full border-4 border-green-800 flex items-center justify-center">
            <motion.div className="w-5 h-5 bg-black rounded-full" animate={{ x: [-6, 6, -6] }} transition={{ duration: 2, repeat: R }} />
        </div>
        <motion.div className="absolute -top-3 w-2 h-4 bg-green-700 rounded-full" animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 1, repeat: R }} />
    </W>,
    // 5 Cat - pink, triangle ears, whiskers
    ({ onClick }) => <W onClick={onClick} className="w-[92px] h-[68px] rounded-2xl shadow-lg" style={{ background: '#EC4899' }}>
        <div className="absolute -top-3 left-2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-pink-500" />
        <div className="absolute -top-3 right-2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-pink-500" />
        <div className="flex gap-5"><div className="w-4 h-5 bg-white rounded-full border border-black/20"><div className="w-1.5 h-3 bg-black rounded-full mt-1 ml-1" /></div>
            <div className="w-4 h-5 bg-white rounded-full border border-black/20"><div className="w-1.5 h-3 bg-black rounded-full mt-1 ml-1" /></div></div>
        <div className="absolute bottom-2.5 w-2 h-2 bg-pink-300 rounded-full" />
        <motion.div className="absolute bottom-2 left-1 w-8 h-0.5 bg-black/20" animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 1.5, repeat: R }} />
        <motion.div className="absolute bottom-2 right-1 w-8 h-0.5 bg-black/20" animate={{ rotate: [3, -3, 3] }} transition={{ duration: 1.5, repeat: R }} />
    </W>,
    // 6 Skull - dark angular, glowing red eyes
    ({ onClick }) => <W onClick={onClick} className="w-[84px] h-[76px] shadow-lg" style={{ background: '#1E1E2E', borderRadius: '8px 8px 20px 20px' }}>
        <div className="flex gap-4">
            <motion.div className="w-5 h-5 bg-red-600 rounded-full" style={{ boxShadow: '0 0 10px #ef4444' }} animate={{ opacity: [.4, 1, .4] }} transition={{ duration: 1.5, repeat: R }} />
            <motion.div className="w-5 h-5 bg-red-600 rounded-full" style={{ boxShadow: '0 0 10px #ef4444' }} animate={{ opacity: [.4, 1, .4] }} transition={{ duration: 1.5, repeat: R, delay: .3 }} />
        </div>
        <div className="absolute bottom-2 flex gap-0.5">{[1, 2, 3, 4].map(i => <div key={i} className="w-2 h-3 bg-gray-700 rounded-sm" />)}</div>
    </W>,
    // 7 Astronaut - white helmet, orange visor
    ({ onClick }) => <W onClick={onClick} className="w-[88px] h-[88px] rounded-full shadow-lg border-4 border-gray-300" style={{ background: '#F3F4F6' }}>
        <motion.div className="w-16 h-8 rounded-full" style={{ background: 'linear-gradient(135deg,#F97316,#FBBF24)' }}
            animate={{ opacity: [.7, 1, .7] }} transition={{ duration: 3, repeat: R }} />
        <div className="absolute -left-2 top-1/2 w-3 h-5 bg-gray-400 rounded-l-full" />
        <div className="absolute -right-2 top-1/2 w-3 h-5 bg-gray-400 rounded-r-full" />
    </W>,
    // 8 Toaster - silver rectangle, toast popping
    ({ onClick }) => <W onClick={onClick} className="w-[88px] h-[68px] rounded-lg shadow-lg" style={{ background: '#D1D5DB' }}>
        <div className="absolute -top-1 flex gap-3">
            <motion.div className="w-5 h-8 bg-amber-700 rounded-sm" animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: R }} />
            <motion.div className="w-5 h-8 bg-amber-700 rounded-sm" animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: R, delay: .5 }} />
        </div>
        <div className="absolute bottom-3 w-4 h-4 bg-orange-400 rounded-full opacity-50" style={{ boxShadow: '0 0 15px #F97316' }} />
        <div className="absolute bottom-1.5 w-6 h-1 bg-gray-400 rounded" />
    </W>,
    // 9 Pumpkin - orange, carved face, glow
    ({ onClick }) => <W onClick={onClick} className="w-[88px] h-[80px] rounded-full shadow-lg" style={{ background: '#F97316' }}>
        <div className="flex gap-4">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-transparent border-b-black" />
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-transparent border-b-black" />
        </div>
        <motion.div className="absolute bottom-3 w-8 h-3 bg-black rounded" animate={{ opacity: [.6, 1, .6] }} transition={{ duration: 1.5, repeat: R }}>
            <div className="absolute inset-0 bg-yellow-400 opacity-40 blur-sm" />
        </motion.div>
        <div className="absolute -top-2 w-2 h-3 bg-green-700 rounded" />
    </W>,
    // 10 Fish - teal, bulging eyes, fins
    ({ onClick }) => <W onClick={onClick} className="w-[100px] h-[64px] rounded-[40px] shadow-lg" style={{ background: '#14B8A6' }}>
        <div className="flex gap-6">
            <motion.div className="w-6 h-7 bg-white rounded-full border-2 border-teal-800 flex items-end justify-center pb-0.5"
                animate={{ scaleY: [1, 1.1, 1] }} transition={{ duration: 1, repeat: R }}><div className="w-2 h-2 bg-black rounded-full" /></motion.div>
            <motion.div className="w-6 h-7 bg-white rounded-full border-2 border-teal-800 flex items-end justify-center pb-0.5"
                animate={{ scaleY: [1, 1.1, 1] }} transition={{ duration: 1, repeat: R, delay: .2 }}><div className="w-2 h-2 bg-black rounded-full" /></motion.div>
        </div>
        <motion.div className="absolute -left-3 w-3 h-6 bg-teal-600 rounded-l-full" animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 1, repeat: R }} />
        <motion.div className="absolute -right-3 w-3 h-6 bg-teal-600 rounded-r-full" animate={{ rotate: [10, -10, 10] }} transition={{ duration: 1, repeat: R }} />
        <motion.div className="absolute bottom-2 w-4 h-2 bg-teal-700 rounded-full" animate={{ scaleX: [1, .6, 1] }} transition={{ duration: 1, repeat: R }} />
    </W>,
    // 11 Crown/King - gold, jewel, points
    ({ onClick }) => <W onClick={onClick} className="w-[96px] h-[72px] shadow-lg" style={{ background: '#EAB308', borderRadius: '4px 4px 16px 16px' }}>
        <div className="absolute -top-4 flex gap-3">
            <div className="w-2 h-4 bg-yellow-500 rounded-t-full" />
            <motion.div className="w-3 h-5 bg-yellow-500 rounded-t-full" animate={{ scaleY: [1, 1.1, 1] }} transition={{ duration: 1, repeat: R }} />
            <div className="w-2 h-4 bg-yellow-500 rounded-t-full" />
        </div>
        <motion.div className="w-6 h-6 bg-red-500 rounded-full border-2 border-red-800" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: R }} style={{ boxShadow: '0 0 8px #ef4444' }} />
        <div className="absolute bottom-2 flex gap-2"><div className="w-3 h-3 bg-yellow-600 rounded-full" /><div className="w-3 h-3 bg-yellow-600 rounded-full" /></div>
    </W>,
    // 12 Alien - light green, big almond eyes, antennae
    ({ onClick }) => <W onClick={onClick} className="w-[80px] h-[84px] rounded-[50%_50%_40%_40%] shadow-lg" style={{ background: '#86EFAC' }}>
        <motion.div className="absolute -top-5 -left-0 w-0.5 h-6 bg-green-500 origin-bottom" animate={{ rotate: [-15, 5, -15] }} transition={{ duration: 2, repeat: R }}>
            <div className="w-2 h-2 bg-green-400 rounded-full -ml-0.5 -mt-1" /></motion.div>
        <motion.div className="absolute -top-5 -right-0 w-0.5 h-6 bg-green-500 origin-bottom" animate={{ rotate: [15, -5, 15] }} transition={{ duration: 2, repeat: R }}>
            <div className="w-2 h-2 bg-green-400 rounded-full -ml-0.5 -mt-1" /></motion.div>
        <div className="flex gap-2 mt-2">
            <motion.div className="w-8 h-5 bg-black rounded-[50%] border border-green-700" animate={{ scaleX: [1, .9, 1] }} transition={{ duration: 3, repeat: R }} />
            <motion.div className="w-8 h-5 bg-black rounded-[50%] border border-green-700" animate={{ scaleX: [1, .9, 1] }} transition={{ duration: 3, repeat: R, delay: .5 }} />
        </div>
    </W>,
].map(c => React.memo(c));
