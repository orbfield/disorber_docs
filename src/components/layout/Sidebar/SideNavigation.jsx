import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Image, Binary, BookOpen, Settings, Folder } from 'lucide-react';
import { scanPagesDirectory } from './utils/pageScanner';

// Icon mapping
const icons = {
  Home,
  Image,
  Binary,
  BookOpen,
  Settings,
  Folder
};

const NavItem = ({ node, isCollapsed, isActive, onToggle, onNavigation }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = icons[node.icon] || icons.Folder;

  const handleClick = (e) => {
    e.stopPropagation();
    if (node.id) {
      onNavigation(node.id);
    }
    if (node.children?.length) {
      onToggle(node);
    }
  };

  return (
    <motion.div
      className={`flex items-center gap-2 px-2 py-1 rounded-xl cursor-pointer ${
        isActive ? 'bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20' : 'text-white'
      }`}
      animate={{
        x: isHovered ? 5 : 0,
        backgroundColor: isHovered ? "rgba(6, 182, 212, 0.1)" : "rgba(0, 0, 0, 0)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      {node.children?.length > 0 && (
        <span className="w-4 text-xs">
          {node.isExpanded ? '▾' : '▸'}
        </span>
      )}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-6 h-6 min-w-[24px]" />
      </motion.div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="font-medium whitespace-nowrap text-sm"
          >
            {node.text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NavTree = ({ nodes, isCollapsed, activeSection, onToggle, onNavigation }) => {
  return (
    <ul className="space-y-1">
      {nodes.map((node, index) => (
        <li key={index}>
          <NavItem
            node={node}
            isCollapsed={isCollapsed}
            isActive={node.id === activeSection}
            onToggle={onToggle}
            onNavigation={onNavigation}
          />
          {node.children?.length > 0 && node.isExpanded && (
            <div className="ml-4">
              <NavTree
                nodes={node.children}
                isCollapsed={isCollapsed}
                activeSection={activeSection}
                onToggle={onToggle}
                onNavigation={onNavigation}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

const SideNavigation = ({ isCollapsed = false, activeSection = '', onNavigation = () => {} }) => {
  const [navTree, setNavTree] = useState([]);

  useEffect(() => {
    const loadNavTree = async () => {
      try {
        // Now we just call scanPagesDirectory without arguments since it manages its own structure
        const tree = await scanPagesDirectory();
        setNavTree(tree);
      } catch (error) {
        console.error('Failed to load navigation tree:', error);
        // Set a fallback navigation structure in case of error
        setNavTree([
          {
            id: 'home',
            text: 'Home',
            icon: 'Home',
            isExpanded: false,
            children: []
          }
        ]);
      }
    };
    loadNavTree();
  }, []);

  const toggleNode = (targetNode) => {
    const updateNodes = (nodes) => {
      return nodes.map(node => {
        if (node === targetNode) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children?.length) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setNavTree(updateNodes(navTree));
  };

  return (
    <nav className="flex-1 overflow-y-auto py-2">
      <NavTree
        nodes={navTree}
        isCollapsed={isCollapsed}
        activeSection={activeSection}
        onToggle={toggleNode}
        onNavigation={onNavigation}
      />
    </nav>
  );
};

export default SideNavigation;