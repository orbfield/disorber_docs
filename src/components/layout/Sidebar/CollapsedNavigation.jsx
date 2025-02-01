import React from 'react';
import { motion } from 'framer-motion';

const CollapsedNavigation = ({ sideNavItems, activeSection, onNavigation }) => {
  return (
    <div className="flex flex-col gap-2">
      {sideNavItems.map((item) => {
        const Icon = item.icon;  // Destructure the icon component
        return (
          <motion.div
            key={item.id}
            onClick={() => onNavigation(item.id)}
            className={`flex items-center justify-center p-2 rounded-xl cursor-pointer
              ${activeSection === item.id ? 'bg-gray-800/50' : 'hover:bg-gray-800/30'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={item.text}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default CollapsedNavigation;