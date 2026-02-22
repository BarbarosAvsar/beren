import React from 'react';
import ToyBtn from './ToyBtn';

const Dashboard = ({
    actions,
    isMoving,
    isDancing,
    onShowGallery,
    galleryCount
}) => {
    return (
        <div className="fixed bottom-0 left-0 w-full flex flex-col items-center gap-6 pb-14 pointer-events-none">
            <div className="flex flex-wrap gap-4 items-end justify-center pointer-events-auto px-4 translate-y-[-10px]">

                <ToyBtn onClick={actions.nextTheme} color="bg-indigo-600" shadow="shadow-indigo-950"
                    label="MAP" icon={<span className="text-4xl">🚀</span>} shape="rounded-3xl" size="w-20 h-20 md:w-24 md:h-24" />

                <ToyBtn onClick={actions.splashColor} color="bg-emerald-500" shadow="shadow-emerald-950"
                    label="COLOR" icon={<span className="text-4xl">🎨</span>} shape="rounded-[40%_60%_70%_30%]" size="w-20 h-20 md:w-24 md:h-24" />

                {/* NEW SIZE BUTTON */}
                <ToyBtn onClick={actions.changeSize} color="bg-pink-500" shadow="shadow-pink-900"
                    label="SIZE" icon={<span className="text-4xl">⚖️</span>} shape="rounded-[20%_50%_20%_50%]" size="w-20 h-20 md:w-24 md:h-24" />

                <ToyBtn onClick={actions.randomize} color="bg-amber-400" shadow="shadow-amber-700"
                    label="MIX!" icon={<span className="text-6xl">🎲</span>} shape="rounded-full" size="w-32 h-32 md:w-44 md:h-44" scale={1.1} />

                <ToyBtn onClick={actions.toggleMove} color={isMoving ? "bg-red-500" : "bg-sky-500"} shadow={isMoving ? "shadow-red-900" : "shadow-sky-900"}
                    label={isMoving ? "STOP" : "GO!"} icon={<span className="text-4xl">{isMoving ? "🛑" : "🏎️"}</span>} shape="rounded-2xl" size="w-20 h-20 md:w-24 md:h-24" />

                <ToyBtn onClick={actions.toggleDance} color={isDancing ? "bg-rose-500" : "bg-fuchsia-500"} shadow={isDancing ? "shadow-rose-900" : "shadow-fuchsia-900"}
                    label="DANCE" icon={<span className="text-4xl">🕺</span>} shape="rounded-t-full" size="w-20 h-20 md:w-24 md:h-24" />

                <div className="w-full h-1 md:hidden" />

                <ToyBtn onClick={actions.takePhoto} color="bg-blue-600" shadow="shadow-blue-900"
                    label="SNAP" icon={<span className="text-4xl">📸</span>} shape="rounded-full" size="w-20 h-20 md:w-24 md:h-24" />

                <ToyBtn onClick={onShowGallery} color="bg-violet-600" shadow="shadow-violet-950"
                    label="BOOK" icon={<div className="relative text-4xl">📖{galleryCount > 0 && <span className="absolute -top-1 -right-3 bg-red-600 text-white text-[14px] w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-white animate-bounce">{galleryCount}</span>}</div>}
                    shape="rounded-[10px_40px_10px_40px]" size="w-20 h-20 md:w-24 md:h-24" />
            </div>
        </div>
    );
};

export default React.memo(Dashboard);
