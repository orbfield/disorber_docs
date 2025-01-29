import React from 'react';
import { motion } from 'framer-motion';

const TopNavItem = ({ text, isActive }) => (
  <motion.div
    className={`px-4 py-2 rounded-xl cursor-pointer ${
      isActive
        ? "bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20"
        : "hover:bg-gray-800/30"
    }`}
    whileHover={{
      y: -2,
      backgroundColor: "rgba(6, 182, 212, 0.1)",
      transition: { duration: 0.2 },
    }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium"
    >
      {text}
    </motion.span>
  </motion.div>
);

export default TopNavItem;
