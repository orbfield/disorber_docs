import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TopNavItem from './TopNavItem';
import { useSidebar } from '../SidebarContext';

const Navbar = () => {
  const { toggleSidebar, isSidebarCollapsed } = useSidebar();
  const [activeMenu, setActiveMenu] = useState(-1);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !e.target.closest('.menu-item')) {
        setActiveMenu(-1);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = (menuIndex) => {
    setActiveMenu(activeMenu === menuIndex ? -1 : menuIndex);
  };

  const MenuItem = ({ label, index, children }) => (
    <div className="relative menu-item">
      <motion.button
        className={`px-4 py-1 text-sm font-medium transition-colors ${
          activeMenu === index
            ? 'bg-gray-800/80 text-white'
            : 'hover:bg-gray-800/50 text-gray-300'
        }`}
        onClick={() => toggleMenu(index)}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
      >
        {label}
      </motion.button>
      {activeMenu === index && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 min-w-[200px] bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-b-lg overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </div>
  );

  const MenuOption = ({ label, separator }) => {
    if (separator) {
      return <div className="h-px bg-gray-700 my-1" />;
    }
    return (
      <motion.button
        className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700/50 transition-colors"
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.97 }}
      >
        {label}
      </motion.button>
    );
  };

  return (
    <motion.header
      ref={navRef}
      className="fixed top-0 right-0 h-8 bg-gray-900/50 backdrop-blur-sm flex justify-between items-center px-4 z-50 shadow-sm"
      style={{ 
        left: isSidebarCollapsed ? '5rem' : '16rem',
        transition: 'left 0.2s ease-in-out'
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <nav className="flex items-center gap-2">
        <div className="flex h-full">
          <MenuItem label="File" index={0}>
            <MenuOption label="New File" />
            <MenuOption label="Open File..." />
            <MenuOption separator />
            <MenuOption label="Save" />
            <MenuOption label="Save As..." />
            <MenuOption separator />
            <MenuOption label="Exit" />
          </MenuItem>
          <MenuItem label="Edit" index={1}>
            <MenuOption label="Cut" />
            <MenuOption label="Copy" />
            <MenuOption label="Paste" />
          </MenuItem>
          <MenuItem label="View" index={2}>
            <MenuOption label="Zoom In" />
            <MenuOption label="Zoom Out" />
            <MenuOption label="Reset Zoom" />
          </MenuItem>
          <MenuItem label="Tools" index={3}>
            <MenuOption label="Colour Picker" />
            <MenuOption label="Measure" />
            <MenuOption label="Theme" />
          </MenuItem>
          <MenuItem label="Help" index={4}>
            <MenuOption label="Getting Started" />
            <MenuOption label="Tips and Tricks" />
            <MenuOption label="Documentation" />
          </MenuItem>
        </div>
      </nav>

      <nav className="flex items-center gap-4">
        <TopNavItem text="About" />
        <TopNavItem text="Store" />
        <TopNavItem text="Account" />
      </nav>
    </motion.header>
  );
};

export default Navbar;
