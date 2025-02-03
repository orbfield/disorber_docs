import React from 'react';
import { motion } from 'framer-motion';

const TopNavItem = ({ text }) => (
  <motion.a
    href="#"
    className="text-sm text-gray-300 hover:text-white transition-colors"
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.97 }}
  >
    {text}
  </motion.a>
);

export default TopNavItem;
