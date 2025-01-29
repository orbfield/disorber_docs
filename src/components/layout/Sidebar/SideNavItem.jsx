import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SideNavItem = ({ icon: Icon, text, isCollapsed, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer backdrop-blur-sm ${
        isActive
          ? "bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20"
          : ""
      }`}
      animate={{
        x: isHovered ? 5 : 0,
        backgroundColor: isHovered ? "rgba(6, 182, 212, 0.1)" : "rgba(0, 0, 0, 0)",
        transition: {
          duration: 0.2,
          backgroundColor: {
            duration: isHovered ? 0.2 : 0.6
          }
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-6 h-6 min-w-[24px]" />
      </motion.div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="font-medium whitespace-nowrap"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SideNavItem;
