import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';

const KeyboardControls = ({ onAddStream }) => {
  const handleKeyDown = useCallback((e) => {
    const key = e.key;
    
    // Only handle number keys 0-9
    if (key >= '0' && key <= '9') {
      const num = key === '0' ? 10 : parseInt(key);
      onAddStream(num);
    }
  }, [onAddStream]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center gap-2 text-sm text-cyan-400/70 bg-black/30 rounded-lg p-2 border border-cyan-500/10"
    >
      <Keyboard size={16} className="text-cyan-400/50" />
      <span>Press 1-0 for streams 1-10</span>
    </motion.div>
  );
};

export default KeyboardControls;
