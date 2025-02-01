import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TreeNode = ({ node, onToggle, isCollapsed, onNavigation }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (node.children?.length) {
      onToggle(node);
    }
    if (node.id) {
      onNavigation(node.id);
    }
  };

  return (
    <li className="py-1">
      <motion.div 
        className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-800/30 cursor-pointer rounded-xl text-white
          ${node.isActive ? 'bg-gray-800/50' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
      >
        <span className={`w-4 ${node.children?.length ? '' : 'invisible'}`}>
          {node.isExpanded ? '▾' : '▸'}
        </span>
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
      </motion.div>
      
      {node.children?.length > 0 && node.isExpanded && (
        <ul className="ml-4">
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
