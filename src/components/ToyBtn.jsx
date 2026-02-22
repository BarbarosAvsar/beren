import React from 'react';
import { motion } from 'framer-motion';

const ToyBtn = ({ onClick, color, shadow, icon, label, shape, size, scale = 1 }) => (
    <motion.button whileHover={{ scale: scale + 0.1, y: -10 }} whileTap={{ scale: 0.8 }} onClick={onClick}
        className={`${size} ${color} ${shape} shadow-[0_15px_0_0] ${shadow} border-[8px] border-white/20 flex flex-col items-center justify-center relative transition-all active:shadow-none active:translate-y-4`}>
        <div className="z-10">{icon}</div>
        <span className="absolute -bottom-10 font-black text-[14px] md:text-[16px] text-white uppercase italic tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,1)] text-center w-full">{label}</span>
    </motion.button>
);

export default React.memo(ToyBtn);
