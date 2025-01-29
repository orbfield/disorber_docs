import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import SideNavItem from './SideNavItem';
import BinaryBackground from '../../ui/backgrounds/BinaryBackground';

const Sidebar = ({ isSidebarCollapsed, setSidebarCollapsed, sideNavItems, activeSection, onNavigation }) => {
  return (
    <motion.div
      layout
      className={`h-screen bg-gray-900/50 backdrop-blur-sm px-4 py-6 flex flex-col gap-2 relative overflow-hidden
        ${isSidebarCollapsed ? "w-20" : "w-64"}`}
    >
      <BinaryBackground isCollapsed={isSidebarCollapsed} />

      <div className="flex items-center justify-between mb-8">
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.h2
              className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              disorber
            </motion.h2>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="p-2 hover:bg-gray-800/30 rounded-xl"
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Menu className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex flex-col gap-2">
        {sideNavItems.map((item) => (
          <div key={item.id} onClick={() => onNavigation(item.id)}>
            <SideNavItem
              icon={item.icon}
              text={item.text}
              isCollapsed={isSidebarCollapsed}
              isActive={activeSection === item.id}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;
