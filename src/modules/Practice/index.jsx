import React from 'react';
import { motion } from 'framer-motion';

const PracticePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
        Practice
      </h1>
      <div className="text-gray-300">
        Practice content will go here
      </div>
    </motion.div>
  );
};

export default PracticePage;