import React from 'react';
import { motion } from 'framer-motion';

// Get a slightly darker/lighter shade for 3D effect
const shadeColor = (color, percent) => {
    let f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

const LegoBlock = ({ 
  color = '#D93838', 
  width = 4, 
  height = 2, 
  style = {},
  children,
  onClick,
  className
}) => {
  const lighter = shadeColor(color, 0.2);
  const darker = shadeColor(color, -0.2);
  const studColor = color;
  const studShadow = 'rgba(0,0,0,0.2)';

  // Calculate pixel dimensions based on "stud units"
  const STUD_SIZE = 40; // larger for 2yo interaction
  const wPx = width * STUD_SIZE;
  const hPx = height * STUD_SIZE;

  // Generate studs array
  const studs = Array.from({ length: width * height }).map((_, i) => ({
    id: i,
    x: (i % width) * STUD_SIZE,
    y: Math.floor(i / width) * STUD_SIZE
  }));

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative rounded-sm shadow-lg ${className}`}
      style={{
        width: wPx,
        height: hPx,
        backgroundColor: color,
        boxShadow: `inset 2px 2px 4px ${lighter}, inset -2px -2px 4px ${darker}, 4px 4px 8px rgba(0,0,0,0.3)`,
        cursor: 'pointer',
        ...style
      }}
    >
      {/* Studs */}
      {studs.map((stud) => (
        <div
          key={stud.id}
          className="absolute rounded-full"
          style={{
            width: STUD_SIZE * 0.6,
            height: STUD_SIZE * 0.6,
            left: stud.x + (STUD_SIZE * 0.2),
            top: stud.y + (STUD_SIZE * 0.2),
            backgroundColor: studColor,
            boxShadow: `inset 1px 1px 2px ${lighter}, inset -1px -1px 2px ${darker}, 1px 1px 2px ${studShadow}`,
            zIndex: 10
          }}
        >
          {/* Top highlight for extra shiny plastic look */}
          <div 
            className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full bg-white opacity-40"
          />
        </div>
      ))}
      {/* Content overlay (eyes, buttons, etc) */}
      <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
};

export default LegoBlock;
