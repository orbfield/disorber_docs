import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import TopNavItem from './TopNavItem';
import WaveBackground from '../../ui/backgrounds/WaveBackground';

const Navbar = () => {
  return (
    <motion.div
      className="h-16 bg-gray-900/50 backdrop-blur-sm w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative z-10 h-full flex items-center justify-between px-6">
        <motion.div className="relative w-96" whileHover={{ scale: 1.02 }}>
          <input
            type="text"
            placeholder="Search site..."
            className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 hover:bg-gray-800/80"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          {["About", "Donate", "Settings", "Help"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <TopNavItem text={item} isActive={false} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
