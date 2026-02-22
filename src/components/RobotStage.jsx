import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Heads from './RobotParts/Heads';
import Bodies from './RobotParts/Bodies';
import Legs from './RobotParts/Legs';
import Arms from './RobotParts/Arms';
import Scenes from './Scenes';

const QUICK_TRANSITION = { type: 'spring', stiffness: 500, damping: 25 };

// --- Connection Pin ---
const Pin = () => <div className="w-3 h-3 bg-slate-400 rounded-full border-2 border-slate-600 shadow-md z-[31]" />;

const RobotStage = ({
    stageRef,
    currentTheme,
    magicSparkle,
    movePos,
    isDancing,
    currentDance,
    emotionIndex,
    EMOTIONS,
    nextEmotion,
    indices,
    palette,
    scale,
    actions
}) => {
    const CurrentScene = Scenes[currentTheme];
    const CurrentHead = Heads[indices.headIndex];
    const CurrentBody = Bodies[indices.bodyIndex];
    const CurrentLegs = Legs[indices.legsIndex];
    const CurrentArms = Arms[indices.armsIndex];

    return (
        <div ref={stageRef} className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {CurrentScene && <CurrentScene />}

            {/* MAGIC BOINGS */}
            <AnimatePresence>
                {magicSparkle.active && (
                    <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[60]"
                        initial={{ scale: 0, opacity: 1 }} animate={{ scale: 6, opacity: 0 }} exit={{ opacity: 0 }}>
                        <div className="flex gap-4 text-amber-300"><Sparkles size={80} fill="currentColor" /></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ROBOT HERO AREA */}
            <div
                className="flex-1 flex items-center justify-center w-full relative z-10 mt-[-80px] transition-transform duration-700 ease-out"
                style={{ transform: `scale(${scale * 1.5})` }} // Base scale for visibility
            >
                {/* MOVE WRAPPER - Persistent Logic */}
                <motion.div animate={{ x: movePos.x, y: movePos.y }} transition={{ duration: 2.5, ease: "easeInOut" }}>
                    {/* DANCE WRAPPER */}
                    <motion.div animate={isDancing ? currentDance.animate : { y: 0, scale: 1, rotate: 0 }}>

                        {/* PHYSICAL TOUCH CONSTRUCTION */}
                        <div className="relative flex flex-col items-center">

                            {/* HERO EMOTION */}
                            <motion.div className="absolute -top-16 -right-14 text-6xl z-50 pointer-events-auto" key={emotionIndex}
                                initial={{ scale: 0, rotate: 15 }} animate={{ scale: 1, rotate: 0 }} onClick={nextEmotion} whileTap={{ scale: 1.4 }}>
                                <div className="bg-white shadow-2xl p-2.5 rounded-full border-4 border-slate-100 flex items-center justify-center">
                                    {EMOTIONS[emotionIndex]}
                                    <div className="absolute -top-2 -left-2 text-2xl animate-pulse">⭐</div>
                                </div>
                            </motion.div>

                            {/* HEAD - Tightened Gaps */}
                            <div className="relative z-30 mb-[-28px]" style={{ filter: `hue-rotate(${palette.h}deg) saturate(1.6) brightness(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.3))` }}>
                                <AnimatePresence mode='wait'>
                                    <motion.div key={indices.headIndex} initial={{ scale: 0.2 }} animate={{ scale: 1 }} transition={QUICK_TRANSITION}>
                                        <CurrentHead onClick={actions.nextHead} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* BODY & ARMS */}
                            <div className="relative z-20 mb-[-28px] flex items-center justify-center min-h-[160px] min-w-[200px]">
                                <div className="absolute inset-0 flex items-center justify-center" style={{ filter: `hue-rotate(${palette.a}deg) saturate(1.6) brightness(1.1)` }}>
                                    <div className="relative w-22 h-40 flex items-center justify-center">
                                        <div className="absolute left-[-2px] top-1/2 -translate-y-1/2"><Pin /></div>
                                        <div className="absolute right-[-2px] top-1/2 -translate-y-1/2"><Pin /></div>
                                        <motion.div key={indices.armsIndex} className="absolute inset-0" onClick={actions.nextArms} whileTap={{ scale: 0.9 }}>
                                            <CurrentArms onClick={actions.nextArms} left={true} />
                                            <CurrentArms onClick={actions.nextArms} left={false} />
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="relative z-[22]" style={{ filter: `hue-rotate(${palette.b}deg) saturate(1.6) brightness(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.3))` }}>
                                    <AnimatePresence mode='wait'>
                                        <motion.div key={indices.bodyIndex} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={QUICK_TRANSITION}>
                                            <CurrentBody onClick={actions.nextBody} />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* LEGS - Tightened Gaps */}
                            <div className="relative z-10" style={{ filter: `hue-rotate(${palette.l}deg) saturate(1.6) brightness(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.3))` }}>
                                <AnimatePresence mode='wait'>
                                    <motion.div key={indices.legsIndex} initial={{ scale: 0.8, y: 15 }} animate={{ scale: 1, y: 0 }} transition={QUICK_TRANSITION}>
                                        <CurrentLegs onClick={actions.nextLegs} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default React.memo(RobotStage);
