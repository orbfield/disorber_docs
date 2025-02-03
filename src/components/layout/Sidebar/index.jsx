import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import ActionButtons from './ActionButtons';
import SearchExplorer from './SearchExplorer';
import SideNavigation from './SideNavigation';

const Sidebar = ({ isSidebarCollapsed, setSidebarCollapsed, activeSection, onNavigation }) => {
  return (
    <motion.div
      layout
      className={`h-screen bg-gray-900/50 backdrop-blur-sm px-4 pt-2 pb-6 flex flex-col gap-1 relative overflow-hidden
        ${isSidebarCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex items-center justify-between mb-1">
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
          <Menu className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {!isSidebarCollapsed && (
        <>
          <ActionButtons />
          <SearchExplorer />
        </>
      )}
      <SideNavigation
        isCollapsed={isSidebarCollapsed}
        activeSection={activeSection}
        onNavigation={onNavigation}
      />
    </motion.div>
  );
};

export default Sidebar;
