import React from 'react';
import { motion } from 'framer-motion';
import { NavProvider } from './NavContext';
import { Menu } from 'lucide-react';
import SearchSite from './SearchSite';
import SideNavigation from './SideNavigation';
import { useSidebar } from '../SidebarContext';

const Sidebar = ({ isSidebarCollapsed, activeSection }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <motion.div
      layout
      transition={{ duration: 0.15 }}
      className={`h-screen bg-gray-900/50 backdrop-blur-sm px-1 pt-1 pb-6 flex flex-col gap-0.5 relative overflow-hidden
        ${isSidebarCollapsed ? "w-16" : "w-64"}`}
    >
      <div className={`flex items-center mb-0.5 ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
        {!isSidebarCollapsed && (
          <div className="flex-grow mr-2">
            <SearchSite />
          </div>
        )}
        <motion.button
          onClick={toggleSidebar}
          className="py-1.5 px-2 hover:bg-gray-800/30 rounded-lg flex items-center justify-center w-10"
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3 }}
        >
          <Menu className="w-5 h-5 text-white" />
        </motion.button>
      </div>
      <SideNavigation
        isCollapsed={isSidebarCollapsed}
        activeSection={activeSection}
      />
    </motion.div>
  );
};

export default Sidebar;
