import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MotionButton = ({
  icon: Icon,
  text,
  isActive,
  onClick,
  className = '',
  variant = 'side',  // 'side' or 'top'
  isCollapsed
}) => {
  const baseStyles = `
    flex items-center backdrop-blur-sm rounded-xl cursor-pointer
    ${variant === 'side' ? 'gap-4 p-3' : 'px-4 py-2'}
    ${isActive
      ? className || "bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20"
      : `hover:bg-gray-800/30 ${className}`
    }
  `.trim();

  return (
    <motion.div
      onClick={onClick}
      className={baseStyles}
      whileHover={{
        [variant === 'side' ? 'x' : 'y']: variant === 'side' ? 5 : -2,
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)',
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
        boxShadow: '0 0 20px rgba(6, 182, 212, 0.7)'
      }}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={24} className={className?.match(/text-[a-z]+-\d+/)?.[0] || "text-cyan-400"} />
        </motion.div>
      )}
      <AnimatePresence>
        {text && !isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: variant === 'side' ? -10 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: variant === 'side' ? -10 : 0 }}
            className={`font-medium whitespace-nowrap ${className?.match(/text-[a-z]+-\d+/)?.[0] || "text-cyan-400"}`}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
