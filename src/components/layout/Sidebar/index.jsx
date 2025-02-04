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
      className={`h-screen bg-gray-900/50 backdrop-blur-sm px-1 pt-1 pb-6 flex flex-col gap-0.5 relative overflow-hidden
        ${isSidebarCollapsed ? "w-16" : "w-64"}`}
    >
      <div className={`flex items-center mb-0.5 ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
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
          className="py-1.5 px-2 hover:bg-gray-800/30 rounded-lg flex items-center justify-center w-10"
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3 }}
        >
          <Menu className="w-5 h-5 text-white" />
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
