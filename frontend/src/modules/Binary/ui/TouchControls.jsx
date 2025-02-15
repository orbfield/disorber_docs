import React from 'react';
import { motion } from 'framer-motion';

const TouchPad = ({ number, onAddStream }) => (
  <motion.button
    onClick={() => onAddStream(number)}
    className="bg-black/30 text-cyan-400 rounded-lg p-3 text-lg font-bold 
               flex items-center justify-center backdrop-blur-sm 
               border border-cyan-500/10 hover:border-cyan-500/30
               transition-all duration-200"
    whileHover={{
      y: -1,
      transition: { duration: 0.2 },
    }}
    whileTap={{ 
      scale: 0.95,
      backgroundColor: 'rgba(6, 182, 212, 0.1)'
    }}
  >
    {number}
  </motion.button>
);

const TouchControls = ({ orientation, onAddStream }) => {
  const getButtonsForOrientation = () => {
    const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
    const buttonsPerPage = orientation === 'portrait' ? 6 : 10;
    return numbers.slice(0, buttonsPerPage);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: 0.2 }}
      className={`grid gap-2 ${orientation === 'portrait' ? 'grid-cols-3' : 'grid-cols-5'}`}
    >
      {getButtonsForOrientation().map(num => (
        <TouchPad key={num} number={num} onAddStream={onAddStream} />
      ))}
    </motion.div>
  );
};

export default TouchControls;
