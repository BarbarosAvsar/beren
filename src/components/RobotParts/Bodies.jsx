import React from 'react';
import { motion } from 'framer-motion';
const R = Infinity;
const W = ({ onClick, children, className = '', style = {} }) => (
    <motion.div onClick={onClick} className={`relative flex items-center justify-center cursor-pointer ${className}`}
        style={style} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>{children}</motion.div>
);
export default [
    // 1 Box Bot - gray rectangle, panel lines, power core
    ({ onClick }) => <W onClick={onClick} className="w-[110px] h-[100px] rounded-xl shadow-lg" style={{ background: '#6B7280' }}>
        <div className="absolute top-3 w-20 h-0.5 bg-gray-500" /><div className="absolute bottom-3 w-20 h-0.5 bg-gray-500" />
        <motion.div className="w-10 h-10 rounded-full border-4 border-gray-500 bg-cyan-400"
            animate={{ scale: [1, 1.15, 1], opacity: [.6, 1, .6] }} transition={{ duration: 2, repeat: R }} style={{ boxShadow: '0 0 15px #22d3ee' }} />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
    </W>,
    // 2 Barrel - brown cylinder
    ({ onClick }) => <W onClick={onClick} className="w-[100px] h-[105px] rounded-[50px] shadow-lg" style={{ background: '#92400E' }}>
        <div className="absolute top-4 w-24 h-1 bg-amber-700 rounded" /><div className="absolute bottom-4 w-24 h-1 bg-amber-700 rounded" />
        <motion.div className="w-6 h-6 bg-amber-600 rounded-full border-2 border-amber-900" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: R, ease: 'linear' }} />
        <div className="absolute w-2 h-2 bg-gray-400 rounded-full top-2 right-6" />
    </W>,
    // 3 Furnace - dark red, fire window
    ({ onClick }) => <W onClick={onClick} className="w-[108px] h-[96px] rounded-2xl shadow-lg" style={{ background: '#7F1D1D' }}>
        <div className="w-16 h-16 bg-red-950 rounded-xl border-2 border-red-800 overflow-hidden flex items-end justify-center">
            <motion.div className="w-12 h-10 bg-orange-500 rounded-t-full blur-[2px]"
                animate={{ scaleY: [.6, 1, .7, .9, .6], scaleX: [.8, 1, .9, 1.1, .8] }} transition={{ duration: 1.5, repeat: R }} />
        </div>
        <div className="absolute top-1 flex gap-1">{[1, 2, 3].map(i => <div key={i} className="w-3 h-1 bg-gray-700" />)}</div>
    </W>,
    // 4 Shield - blue chevron, star emblem
    ({ onClick }) => <W onClick={onClick} className="w-[100px] h-[110px] shadow-lg" style={{ background: '#2563EB', borderRadius: '8px 8px 50% 50%' }}>
        <motion.div className="text-3xl" animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: R, ease: 'linear' }}>⭐</motion.div>
        <div className="absolute top-2 w-16 h-1 bg-blue-400 rounded" />
        <div className="absolute bottom-6 w-12 h-1 bg-blue-400 rounded" />
    </W>,
    // 5 Sphere - purple ball, belly button
    ({ onClick }) => <W onClick={onClick} className="w-[105px] h-[105px] rounded-full shadow-lg" style={{ background: '#7C3AED' }}>
        <motion.div className="w-8 h-8 rounded-full border-4 border-purple-400 bg-purple-300"
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: R }} />
        <motion.div className="absolute w-full h-full rounded-full border-4 border-dashed border-purple-300 opacity-20"
            animate={{ rotate: 360 }} transition={{ duration: 15, repeat: R, ease: 'linear' }} />
    </W>,
    // 6 Music Box - orange, speakers, equalizer
    ({ onClick }) => <W onClick={onClick} className="w-[112px] h-[96px] rounded-xl shadow-lg" style={{ background: '#EA580C' }}>
        <div className="flex gap-3">
            <motion.div className="w-10 h-10 rounded-full border-4 border-orange-800 bg-orange-400"
                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: .3, repeat: R }} />
            <div className="flex gap-0.5 items-end">{[6, 10, 4, 8, 5].map((h, i) =>
                <motion.div key={i} className="w-1.5 bg-yellow-300 rounded-t" style={{ height: h }}
                    animate={{ height: [h, h * 1.8, h] }} transition={{ duration: .4, repeat: R, delay: i * .1 }} />
            )}</div>
        </div>
    </W>,
    // 7 Safe - dark gray, vault door
    ({ onClick }) => <W onClick={onClick} className="w-[106px] h-[100px] rounded-xl shadow-lg border-4 border-gray-600" style={{ background: '#374151' }}>
        <div className="w-16 h-16 rounded-full border-4 border-gray-500 bg-gray-700 flex items-center justify-center">
            <motion.div className="w-8 h-1.5 bg-yellow-500 rounded origin-left" animate={{ rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 4, repeat: R, ease: 'linear' }} />
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">{[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-500" />)}</div>
    </W>,
    // 8 Rocket - white/red, window, exhaust
    ({ onClick }) => <W onClick={onClick} className="w-[90px] h-[110px] shadow-lg" style={{ background: '#F1F5F9', borderRadius: '50% 50% 20% 20%' }}>
        <div className="w-8 h-8 rounded-full bg-sky-300 border-2 border-sky-500 -mt-4" />
        <div className="absolute bottom-0 w-full h-6 bg-red-500 rounded-b-lg" />
        <motion.div className="absolute -bottom-3 w-4 h-6 bg-orange-400 rounded-b-full blur-[1px]"
            animate={{ scaleY: [.5, 1, .5], opacity: [.5, 1, .5] }} transition={{ duration: .3, repeat: R }} />
    </W>,
    // 9 Cage/Heart - wire frame, heart inside
    ({ onClick }) => <W onClick={onClick} className="w-[100px] h-[96px] rounded-xl shadow-lg border-4 border-dashed border-gray-500" style={{ background: 'rgba(75,85,99,.3)' }}>
        <motion.div className="text-4xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: .8, repeat: R }}>💜</motion.div>
    </W>,
    // 10 Gift Box - pink, ribbon, bow
    ({ onClick }) => <W onClick={onClick} className="w-[104px] h-[96px] rounded-xl shadow-lg" style={{ background: '#F472B6' }}>
        <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-3 bg-yellow-300" /></div>
        <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-full bg-yellow-300" /></div>
        <motion.div className="absolute -top-4 text-2xl" animate={{ rotate: [-5, 5, -5], y: [0, -2, 0] }} transition={{ duration: 1, repeat: R }}>🎀</motion.div>
    </W>,
    // 11 Engine - dark, exhaust pipes, rivets, warning light
    ({ onClick }) => <W onClick={onClick} className="w-[112px] h-[96px] rounded-lg shadow-lg" style={{ background: '#1E293B' }}>
        <div className="absolute -left-3 w-3 h-12 bg-gray-600 rounded-l-full" />
        <div className="absolute -right-3 w-3 h-12 bg-gray-600 rounded-r-full" />
        <motion.div className="w-4 h-4 rounded-full bg-red-500 mb-1" animate={{ opacity: [.3, 1, .3] }} transition={{ duration: .5, repeat: R }} style={{ boxShadow: '0 0 8px #ef4444' }} />
        <div className="flex gap-1 mt-1">{[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-gray-600" />)}</div>
        <div className="absolute bottom-2 w-16 h-0.5 bg-gray-600" />
    </W>,
    // 12 Cauldron - purple, bubbling
    ({ onClick }) => <W onClick={onClick} className="w-[100px] h-[100px] shadow-lg" style={{ background: '#581C87', borderRadius: '20% 20% 50% 50%' }}>
        <div className="absolute top-0 w-full h-3 bg-green-500 rounded-t-lg opacity-60" />
        {[0, 1, 2].map(i => <motion.div key={i} className="absolute w-3 h-3 rounded-full bg-green-400 opacity-50"
            style={{ left: 20 + i * 25, top: 5 }} animate={{ y: [0, -20, -30], opacity: [.6, .3, 0], scale: [1, .5, 0] }}
            transition={{ duration: 1.5, repeat: R, delay: i * .5 }} />)}
        <motion.div className="text-2xl mt-4" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: R }}>🧪</motion.div>
    </W>,
].map(c => React.memo(c));
