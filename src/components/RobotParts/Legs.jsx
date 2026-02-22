import React from 'react';
import { motion } from 'framer-motion';
const R = Infinity;
const W = ({ onClick, children, className = '', style = {} }) => (
    <motion.div onClick={onClick} className={`relative flex items-center justify-center cursor-pointer ${className}`}
        style={style} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>{children}</motion.div>
);
export default [
    // 1 Biped - walking tilt animation
    ({ onClick }) => <W onClick={onClick} className="w-[80px] h-[60px]">
        <div className="flex gap-4">
            <motion.div className="flex flex-col items-center" animate={{ y: [0, -3, 0] }} transition={{ duration: .8, repeat: R }}>
                <div className="w-4 h-8 bg-gray-500 rounded-sm" /><div className="w-6 h-3 bg-gray-600 rounded-b-md mt-[-1px]" />
            </motion.div>
            <motion.div className="flex flex-col items-center" animate={{ y: [-3, 0, -3] }} transition={{ duration: .8, repeat: R }}>
                <div className="w-4 h-8 bg-gray-500 rounded-sm" /><div className="w-6 h-3 bg-gray-600 rounded-b-md mt-[-1px]" />
            </motion.div>
        </div>
    </W>,
    // 2 Thick Boots
    ({ onClick }) => <W onClick={onClick} className="w-[90px] h-[50px]">
        <div className="flex gap-4">
            <motion.div className="w-8 h-10 bg-amber-800 rounded-lg rounded-t-sm border-b-4 border-amber-950" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 1, repeat: R }} />
            <motion.div className="w-8 h-10 bg-amber-800 rounded-lg rounded-t-sm border-b-4 border-amber-950" animate={{ rotate: [2, -2, 2] }} transition={{ duration: 1, repeat: R }} />
        </div>
    </W>,
    // 3 Wheels - spinning
    ({ onClick }) => <W onClick={onClick} className="w-[80px] h-[40px]">
        <div className="flex gap-2 items-center">
            <motion.div className="w-10 h-10 rounded-full bg-gray-800 border-4 border-gray-600 flex items-center justify-center"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: R, ease: 'linear' }}><div className="w-2 h-full bg-gray-500" /></motion.div>
            <div className="w-4 h-2 bg-gray-500" />
            <motion.div className="w-10 h-10 rounded-full bg-gray-800 border-4 border-gray-600 flex items-center justify-center"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: R, ease: 'linear' }}><div className="w-2 h-full bg-gray-500" /></motion.div>
        </div>
    </W>,
    // 4 Tank Treads
    ({ onClick }) => <W onClick={onClick} className="w-[110px] h-[36px]">
        <motion.div className="w-full h-8 bg-gray-800 rounded-lg flex items-center justify-around px-1 border-2 border-gray-600"
            animate={{ backgroundPosition: ['0px 0px', '20px 0px'] }} transition={{ duration: .5, repeat: R, ease: 'linear' }}>
            {[1, 2, 3, 4, 5].map(i => <motion.div key={i} className="w-4 h-4 bg-gray-600 rounded-full" animate={{ rotate: 360 }} transition={{ duration: .5, repeat: R, ease: 'linear' }} />)}
        </motion.div>
    </W>,
    // 5 Hover Pad - floating, energy glow
    ({ onClick }) => <W onClick={onClick} className="w-[90px] h-[36px]">
        <motion.div className="w-20 h-4 bg-gray-500 rounded-full" animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, repeat: R }} />
        <motion.div className="absolute bottom-0 w-16 h-3 bg-cyan-400 rounded-full blur-sm" style={{ boxShadow: '0 4px 15px #22d3ee' }}
            animate={{ opacity: [.4, .8, .4], scaleX: [.8, 1, .8] }} transition={{ duration: 1, repeat: R }} />
    </W>,
    // 6 Springs - bouncing coils
    ({ onClick }) => <W onClick={onClick} className="w-[70px] h-[60px]">
        <div className="flex gap-6">
            <motion.div className="flex flex-col items-center" animate={{ scaleY: [1, .7, 1.2, 1] }} transition={{ duration: .6, repeat: R }}>
                <svg width="16" height="40"><path d="M2,0 L14,8 L2,16 L14,24 L2,32 L14,40" stroke="#EAB308" strokeWidth="3" fill="none" /></svg>
            </motion.div>
            <motion.div className="flex flex-col items-center" animate={{ scaleY: [1, 1.2, .7, 1] }} transition={{ duration: .6, repeat: R }}>
                <svg width="16" height="40"><path d="M2,0 L14,8 L2,16 L14,24 L2,32 L14,40" stroke="#EAB308" strokeWidth="3" fill="none" /></svg>
            </motion.div>
        </div>
    </W>,
    // 7 Chicken Legs
    ({ onClick }) => <W onClick={onClick} className="w-[80px] h-[65px]">
        <div className="flex gap-6">
            <motion.div className="flex flex-col items-center" animate={{ rotate: [-3, 3, -3] }} transition={{ duration: .8, repeat: R }}>
                <div className="w-2 h-6 bg-yellow-500" /><div className="w-2 h-8 bg-yellow-500 -ml-1 origin-top rotate-[30deg]" />
                <div className="flex gap-0.5 -mt-1"><div className="w-2 h-2 bg-yellow-600 rounded-full" /><div className="w-2 h-2 bg-yellow-600 rounded-full" /><div className="w-2 h-2 bg-yellow-600 rounded-full" /></div>
            </motion.div>
            <motion.div className="flex flex-col items-center" animate={{ rotate: [3, -3, 3] }} transition={{ duration: .8, repeat: R }}>
                <div className="w-2 h-6 bg-yellow-500" /><div className="w-2 h-8 bg-yellow-500 ml-1 origin-top rotate-[-30deg]" />
                <div className="flex gap-0.5 -mt-1"><div className="w-2 h-2 bg-yellow-600 rounded-full" /><div className="w-2 h-2 bg-yellow-600 rounded-full" /><div className="w-2 h-2 bg-yellow-600 rounded-full" /></div>
            </motion.div>
        </div>
    </W>,
    // 8 Tentacles - wavy
    ({ onClick }) => <W onClick={onClick} className="w-[90px] h-[50px]">
        <div className="flex gap-2 items-start">
            {[0, 1, 2, 3].map(i => <motion.div key={i} className="w-3 rounded-full origin-top" style={{ height: 30 + i * 5, background: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6'][i] }}
                animate={{ rotate: [-8, 8, -8], scaleY: [1, 1.1, .9, 1] }} transition={{ duration: 1.2, repeat: R, delay: i * .15 }} />)}
        </div>
    </W>,
    // 9 Unicycle
    ({ onClick }) => <W onClick={onClick} className="w-[50px] h-[55px]">
        <div className="w-1 h-4 bg-gray-500" />
        <motion.div className="w-12 h-12 rounded-full bg-gray-800 border-4 border-gray-500 flex items-center justify-center"
            animate={{ rotate: 360 }} transition={{ duration: .8, repeat: R, ease: 'linear' }}>
            <div className="w-1 h-full bg-gray-400" />
            <div className="absolute w-full h-1 bg-gray-400" />
        </motion.div>
    </W>,
    // 10 Rocket Boots
    ({ onClick }) => <W onClick={onClick} className="w-[80px] h-[55px]">
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-500 rounded-md" />
                <motion.div className="w-4 h-6 bg-gradient-to-b from-orange-500 to-yellow-300 rounded-b-full blur-[1px]"
                    animate={{ scaleY: [.4, 1, .4], opacity: [.5, 1, .5] }} transition={{ duration: .2, repeat: R }} />
            </div>
            <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-500 rounded-md" />
                <motion.div className="w-4 h-6 bg-gradient-to-b from-orange-500 to-yellow-300 rounded-b-full blur-[1px]"
                    animate={{ scaleY: [.4, 1, .4], opacity: [.5, 1, .5] }} transition={{ duration: .2, repeat: R, delay: .1 }} />
            </div>
        </div>
    </W>,
    // 11 Spider Legs
    ({ onClick }) => <W onClick={onClick} className="w-[120px] h-[50px]">
        <div className="relative w-8 h-3 bg-gray-700 rounded-full">
            {[-55, -35, -15, 15, 35, 55].map((deg, i) =>
                <motion.div key={i} className="absolute w-1 h-8 bg-gray-600 origin-top" style={{ left: i < 3 ? 0 : 24, top: 0, rotate: deg }}
                    animate={{ rotate: [deg, deg + 5, deg - 5, deg] }} transition={{ duration: 1, repeat: R, delay: i * .1 }}>
                    <div className="absolute bottom-0 w-2 h-1 bg-gray-500 -ml-0.5" />
                </motion.div>
            )}
        </div>
    </W>,
    // 12 Pogo Stick
    ({ onClick }) => <W onClick={onClick} className="w-[40px] h-[65px]">
        <motion.div className="flex flex-col items-center" animate={{ y: [0, -8, 0] }} transition={{ duration: .5, repeat: R }}>
            <div className="w-8 h-2 bg-red-500 rounded-full" />
            <div className="w-1.5 h-8 bg-gray-500" />
            <motion.div animate={{ scaleY: [1, .6, 1] }} transition={{ duration: .5, repeat: R }}
                className="w-4 h-4 border-2 border-gray-600 rounded-b-full" />
            <div className="w-4 h-1 bg-gray-700 rounded-full mt-[-2px]" />
        </motion.div>
    </W>,
].map(c => React.memo(c));
