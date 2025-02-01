import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Play, Pause, Info, ArrowUpRight, ArrowDownRight, Settings, Zap } from 'lucide-react';

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

const Sidebar = ({ isSidebarCollapsed, setSidebarCollapsed, sideNavItems, activeSection, onNavigation }) => {
  // navigation items with children
  const enhancedNavItems = [
    {
      ...sideNavItems[0], // Home
      isExpanded: false,
      children: []
    },
    {
      ...sideNavItems[1], // Image
      isExpanded: false,
      children: [
        {
          text: 'Image Processing',
          icon: '🖼️',
          children: [
            {
              text: 'Filters',
              icon: '🎨',
              children: []
            },
            {
              text: 'Effects',
              icon: '✨',
              children: []
            }
          ]
        },
      ]
    },
    {
      ...sideNavItems[2], // Gif
      isExpanded: false,
      children: [
        {
          text: 'Animation Tools',
          icon: '🎬',
          children: [
            {
              text: 'Frame Editor',
              icon: '🎞️',
              children: []
            }
          ]
        }
      ]
    },
    {
      ...sideNavItems[3], // Binary
      isExpanded: false,
      children: [
        {
          text: 'Converters',
          icon: '🔄',
          children: []
        },
        {
          text: 'Analyzers',
          icon: '🔍',
          children: []
        }
      ]
    },
    {
      ...sideNavItems[4], // Docs
      isExpanded: false,
      children: [
        {
          text: 'Guides',
          icon: '📚',
          children: []
        },
        {
          text: 'API Reference',
          icon: '📑',
          children: []
        }
      ]
    },
    {
      ...sideNavItems[5], // Settings
      isExpanded: false,
      children: [
        {
          text: 'Preferences',
          icon: '⚙️',
          children: []
        },
        {
          text: 'Theme',
          icon: '🎨',
          children: []
        }
      ]
    }
  ];

  //  site modules example
  const initialTreeData = [
    ...enhancedNavItems.map(item => ({
      ...item,
      isActive: activeSection === item.id,
    })),
    {
      text: 'Site Modules',
      icon: '📁',
      isExpanded: false,
      children: [
        {
          text: 'Data Analysis',
          icon: '📊',
          isExpanded: false,
          children: [
            {
              text: 'Visualizations',
              icon: '📈',
              children: []
            }
          ]
        },
        {
          text: 'Math Models',
          icon: '🔢',
          children: []
        }
      ]
    }
  ];

  const [treeData, setTreeData] = useState(initialTreeData);

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
        // navigation buttons with tooltips
        <div className="flex flex-col gap-2">
          {sideNavItems.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => onNavigation(item.id)}
              className={`flex items-center justify-center p-2 rounded-xl cursor-pointer
                ${activeSection === item.id ? 'bg-gray-800/50' : 'hover:bg-gray-800/30'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={item.text}
            >
              <item.icon className="w-6 h-6 text-white" />
            </motion.div>
          ))}
        </div>
      ) : (
        // explorer view with tree nodes
        <>
          <div className="flex gap-1 mb-4 flex-wrap">
            {[
              { Icon: Play, title: 'Play' },
              { Icon: Pause, title: 'Pause' },
              { Icon: Info, title: 'Info' },
              { Icon: ArrowUpRight, title: 'Up' },
              { Icon: ArrowDownRight, title: 'Down' },
              { Icon: Settings, title: 'Settings' },
              { Icon: Zap, title: 'Actions' }
            ].map(({ Icon, title }, index) => (
              <motion.button
                key={index}
                className="p-1.5 hover:bg-gray-800/30 rounded-xl text-white"
                title={title}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={16} />
              </motion.button>
            ))}
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Explorer (Ctrl+;)"
              className="w-full px-3 py-1.5 text-sm bg-gray-800/30 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
            />
          </div>

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