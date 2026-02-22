import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import domtoimage from 'dom-to-image-more';

import Scenes from './components/Scenes';
import SparkleTrail from './components/SparkleTrail';
import RobotStage from './components/RobotStage';
import Dashboard from './components/Dashboard';
import GalleryModal from './components/GalleryModal';
import { useSound } from './hooks/useSound';
import { useRobotState } from './hooks/useRobotState';

const THEMES = Object.keys(Scenes);

const DANCE_STYLES = [
  { name: 'Bounce', animate: { y: [0, -50, 0], scale: [1, 1.1, .85, 1], transition: { duration: .5, repeat: Infinity } } },
  { name: 'Twist', animate: { rotate: [-20, 20, -20], transition: { duration: .6, repeat: Infinity } } },
  { name: 'Shimmy', animate: { x: [-20, 20, -20], rotate: [-5, 5, -5], transition: { duration: .25, repeat: Infinity } } },
  { name: 'Disco', animate: { scale: [1, .8, 1.2, 1], rotate: [-3, 3, -3], x: [-10, 10, -10], transition: { duration: .6, repeat: Infinity } } },
];

function App() {
  const { playClick, playBoing, playSuccess, playCamera, playScratch, speak, startMusic, stopMusic } = useSound();
  const { indices, robotName, palette, scale, EMOTIONS, actions: robotActions } = useRobotState();

  const stageRef = useRef(null);

  const [themeIndex, setThemeIndex] = useState(0);
  const [danceIndex, setDanceIndex] = useState(0);

  const [isDancing, setIsDancing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [movePos, setMovePos] = useState({ x: 0, y: 0 });

  const [showGallery, setShowGallery] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [toast, setToast] = useState('');
  const [magicSparkle, setMagicSparkle] = useState({ active: false });
  const [flash, setFlash] = useState(false);

  useEffect(() => { try { const s = localStorage.getItem('robo-gallery-v8'); if (s) setGallery(JSON.parse(s)); } catch (e) { } }, []);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2000); return () => clearTimeout(t); } }, [toast]);

  // Persistent Movement Loop
  useEffect(() => {
    let interval;
    if (isMoving) {
      interval = setInterval(() => {
        setMovePos(p => {
          const nextX = p.x + (Math.random() - 0.5) * 150;
          const nextY = p.y + (Math.random() - 0.5) * 60;
          return {
            x: Math.max(-250, Math.min(250, nextX)),
            y: Math.max(-100, Math.min(50, nextY))
          };
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isMoving]);

  const triggerMagic = useCallback(() => {
    setMagicSparkle({ active: true });
    setTimeout(() => setMagicSparkle({ active: false }), 800);
  }, []);

  const nextTheme = useCallback(() => {
    playSuccess();
    const n = (themeIndex + 1) % THEMES.length;
    setThemeIndex(n);
    speak(THEMES[n]);
  }, [themeIndex, playSuccess, speak]);

  const toggleDance = useCallback(() => {
    if (isDancing) { playScratch(); setIsDancing(false); stopMusic(); }
    else {
      const n = (danceIndex + 1) % DANCE_STYLES.length;
      setDanceIndex(n);
      speak(DANCE_STYLES[n].name + "!");
      setIsDancing(true);
      startMusic();
    }
  }, [isDancing, danceIndex, playScratch, stopMusic, speak, startMusic]);

  const takePhoto = useCallback(async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    playCamera();
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    await new Promise(r => setTimeout(r, 400));

    let dataUrl = null;
    if (stageRef.current) {
      try {
        dataUrl = await domtoimage.toPng(stageRef.current, {
          bgcolor: '#000',
          quality: 1,
          width: stageRef.current.offsetWidth,
          height: stageRef.current.offsetHeight,
          style: { 'filter': 'none', 'border-radius': '0' }
        });
      } catch (e) { console.error('Capture failed:', e); }
    }

    if (dataUrl && dataUrl.length > 500) {
      const entry = { id: Date.now(), name: robotName, image: dataUrl };
      const updated = [entry, ...gallery].slice(0, 15);
      setGallery(updated);
      localStorage.setItem('robo-gallery-v8', JSON.stringify(updated));
      setToast('✨ MAGIC STICKER! ✨');
    }
    setIsCapturing(false);
  }, [isCapturing, robotName, gallery, playCamera]);

  const downloadFromGallery = useCallback((entry) => {
    const link = document.createElement('a');
    link.href = entry.image;
    link.download = `Robot-${entry.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('💾 SAVED!');
  }, []);

  const combinedActions = useMemo(() => ({
    ...robotActions,
    nextHead: () => { playBoing(); robotActions.nextHead(); triggerMagic(); },
    nextBody: () => { playBoing(); robotActions.nextBody(); triggerMagic(); },
    nextLegs: () => { playBoing(); robotActions.nextLegs(); triggerMagic(); },
    nextArms: (e) => { if (e) e.stopPropagation(); playBoing(); robotActions.nextArms(); triggerMagic(); },
    randomize: () => { playSuccess(); speak("SUPER MIX!"); robotActions.randomize(); setMovePos({ x: 0, y: 0 }); triggerMagic(); },
    splashColor: () => { robotActions.splashColor(); playSuccess(); speak("Color Splash!"); triggerMagic(); },
    changeSize: () => { playBoing(); const newScale = robotActions.changeSize(); speak(newScale > 1.5 ? "Extra Big!" : newScale < 0.8 ? "Extra Small!" : "Resize!"); triggerMagic(); },
    nextTheme,
    toggleDance,
    toggleMove: () => { playClick(); setIsMoving(!isMoving); },
    takePhoto,
  }), [robotActions, playBoing, triggerMagic, playSuccess, speak, nextTheme, toggleDance, playClick, isMoving, takePhoto]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-between overflow-hidden select-none bg-black font-['Outfit']">
      <SparkleTrail />

      {/* EYE-SAFE FLASH */}
      <AnimatePresence>
        {flash && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}
          className="fixed inset-0 bg-white z-[500] pointer-events-none" />}
      </AnimatePresence>

      <RobotStage
        stageRef={stageRef}
        currentTheme={THEMES[themeIndex]}
        magicSparkle={magicSparkle}
        movePos={movePos}
        isDancing={isDancing}
        currentDance={DANCE_STYLES[danceIndex]}
        emotionIndex={indices.emotionIndex}
        EMOTIONS={EMOTIONS}
        nextEmotion={robotActions.nextEmotion}
        indices={indices}
        palette={palette}
        scale={scale}
        actions={combinedActions}
      />

      {/* --- UI LAYER --- */}
      <div className="w-full h-full flex flex-col items-center justify-between p-6 z-[100] pointer-events-none">
        {/* CHAMPION PLATE */}
        <motion.div className="bg-slate-300 p-1.5 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] border-b-8 border-slate-500 pointer-events-auto"
          whileTap={{ scale: 1.15, rotate: 2 }} onClick={() => { robotActions.nextName(); playClick(); }}>
          <div className="bg-slate-900 px-12 py-3 rounded-2xl flex items-center gap-6 border-2 border-slate-600">
            <div className="w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap drop-shadow-lg">{robotName}</h1>
            <div className="w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse" />
          </div>
        </motion.div>

        <Dashboard
          actions={combinedActions}
          isMoving={isMoving}
          isDancing={isDancing}
          onShowGallery={() => { setShowGallery(true); playClick(); }}
          galleryCount={gallery.length}
        />
      </div>

      <GalleryModal
        showGallery={showGallery}
        gallery={gallery}
        onClose={() => setShowGallery(false)}
        onDownload={downloadFromGallery}
      />

      {/* BIG TOASTS */}
      <AnimatePresence>
        {toast && (
          <motion.div className="fixed top-28 z-[500] bg-amber-400 border-[10px] border-white px-16 py-5 rounded-[4rem] shadow-[0_25px_80px_rgba(0,0,0,0.4)]"
            initial={{ scale: 0, y: -150 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, opacity: 0 }}>
            <span className="font-black text-5xl italic text-slate-900 uppercase tracking-tighter drop-shadow-md">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
