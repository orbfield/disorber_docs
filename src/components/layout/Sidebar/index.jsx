import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import TreeNode from './TreeNode';
import CollapsedNavigation from './CollapsedNavigation';
import ActionButtons from './ActionButtons';
import SearchExplorer from './SearchExplorer';
import { createEnhancedNavItems, createInitialTreeData } from './navigationData';

const Sidebar = ({ isSidebarCollapsed, setSidebarCollapsed, sideNavItems, activeSection, onNavigation }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const enhancedNavItems = createEnhancedNavItems(sideNavItems);
    const initialData = createInitialTreeData(enhancedNavItems, activeSection);
    setTreeData(initialData);
  }, [sideNavItems, activeSection]);

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
    setTreeData(updateNodes(treeData));
  };

  return (
    <motion.div
      layout
      className={`h-screen bg-gray-900/50 backdrop-blur-sm px-4 py-6 flex flex-col gap-2 relative overflow-hidden
        ${isSidebarCollapsed ? "w-20" : "w-64"}`}
    >
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
          <Menu className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {isSidebarCollapsed ? (
        <CollapsedNavigation 
          sideNavItems={sideNavItems}
          activeSection={activeSection}
          onNavigation={onNavigation}
        />
      ) : (
        <>
          <ActionButtons />
          <SearchExplorer />
          <nav className="flex-1 overflow-y-auto">
            <ul>
              {treeData.map((node, index) => (
                <TreeNode
                  key={index}
                  node={node}
                  onToggle={toggleNode}
                  isCollapsed={isSidebarCollapsed}
                  onNavigation={onNavigation}
                />
              ))}
            </ul>
          </nav>
        </>
      )}
    </motion.div>
  );
};

export default Sidebar;
