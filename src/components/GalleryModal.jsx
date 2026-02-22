import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Heart } from 'lucide-react';

const GalleryModal = ({ showGallery, gallery, onClose, onDownload }) => {
    return (
        <AnimatePresence>
            {showGallery && (
                <motion.div className="fixed inset-0 bg-[#fffbed] z-[400] flex flex-col items-center pointer-events-auto overflow-hidden"
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>

                    <div className="w-full flex justify-between items-center p-8 bg-white shadow-xl border-b-8 border-yellow-200">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl">✨</span>
                            <h2 className="text-5xl font-black text-slate-800 tracking-tighter italic uppercase">My Magic Book</h2>
                            <span className="text-5xl">✨</span>
                        </div>
                        <button onClick={onClose} className="bg-red-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-[0_8px_0_0_#991b1b] active:shadow-none active:translate-y-2 transition-all">
                            <X size={48} />
                        </button>
                    </div>

                    <div className="flex-1 w-full overflow-y-auto p-12 bg-pattern">
                        {gallery.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-40 gap-10">
                                <div className="text-[10rem] animate-bounce">📸</div>
                                <p className="text-5xl font-black text-slate-400">Click SNAP to add stickers!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-7xl mx-auto pb-32">
                                {gallery.map((entry, idx) => (
                                    <motion.div key={entry.id} initial={{ scale: 0, rotate: idx % 2 === 0 ? -8 : 8 }} animate={{ scale: 1, rotate: idx % 2 === 0 ? -4 : 4 }}
                                        whileHover={{ scale: 1.05, rotate: 0 }} className="relative bg-white p-6 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-4 border-white">

                                        {/* Photo Sticker */}
                                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative border-[12px] border-slate-50 bg-slate-900 shadow-inner">
                                            <img src={entry.image} className="w-full h-full object-cover" alt="sticker" />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/10 opacity-50" />
                                        </div>

                                        <div className="mt-8 flex items-center justify-between px-4">
                                            <span className="font-black text-3xl text-slate-800 italic uppercase tracking-tighter">{entry.name}</span>
                                            <button onClick={() => onDownload(entry)}
                                                className="bg-sky-500 hover:bg-sky-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all border-4 border-white">
                                                <Download size={32} />
                                            </button>
                                        </div>

                                        {/* Visual Magic */}
                                        <div className="absolute -top-6 -left-6 text-6xl drop-shadow-md">⭐</div>
                                        <div className="absolute -bottom-6 -right-6 text-6xl drop-shadow-md">✨</div>
                                        <div className="absolute top-1/2 left-0 w-full flex justify-between px-2 opacity-50 pointer-events-none">
                                            <Heart className="text-rose-400 fill-rose-400" size={32} />
                                            <Heart className="text-rose-400 fill-rose-400" size={32} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(GalleryModal);
