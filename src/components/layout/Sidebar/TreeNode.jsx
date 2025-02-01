import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TreeNode = ({ node, onToggle, isCollapsed, onNavigation }) => {
  const handleArrowClick = (e) => {
    e.stopPropagation();
    if (node.children?.length) {
      onToggle(node);
    }
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    
    // First expand the tree if needed
    if (node.children?.length && !node.isExpanded) {
      onToggle(node);
    }
    
    // Then navigate after a small delay
    if (node.id) {
      setTimeout(() => {
        onNavigation(node.id);
      }, 50);
    }
  };

  return (
    <li className="py-1">
      <div 
        className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-800/30 rounded-xl text-white
          ${node.isActive ? 'bg-gray-800/50' : ''}`}
      >
        <span 
          className={`w-4 ${node.children?.length ? 'cursor-pointer' : 'invisible'}`}
          onClick={handleArrowClick}
        >
          {node.isExpanded ? '▾' : '▸'}
        </span>
        <div 
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={handleTitleClick}
        >
          {node.icon && typeof node.icon === 'string' ? (
            <span className="w-5">{node.icon}</span>
          ) : (
            node.icon && <node.icon className="w-6 h-6 text-white" />
          )}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {node.text}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {node.children?.length > 0 && node.isExpanded && (
        <ul className="ml-4 relative z-50 pointer-events-none">
          {node.children.map((child, index) => (
            <TreeNode 
              key={index} 
              node={child} 
              onToggle={onToggle}
              isCollapsed={isCollapsed}
              onNavigation={onNavigation}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
