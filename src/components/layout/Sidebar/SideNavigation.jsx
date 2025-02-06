import React, { useState } from 'react';
import { Home, Image, Binary, BookOpen, Settings, Folder, ChevronRight, ChevronDown, Play } from 'lucide-react';
import { useNav } from './NavContext';

const icons = {
  Home,
  Image,
  Binary,
  BookOpen,
  Settings,
  Folder,
  Play
};

const NavItem = ({ node, isCollapsed, isActive, onToggle, onNavigation }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = icons[node.icon] || icons.Folder;
  const hasChildren = node.children?.length > 0;

  const handleArrowClick = (e) => {
    e.stopPropagation();
    onToggle(node);
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    if (node.id) {
      onNavigation(node.id, node.path || node.id, node.type);
      if (hasChildren && !node.isExpanded) {
        onToggle(node);
      }
    }
  };

  return (
    <div
      className={`flex items-center cursor-pointer text-gray-300 hover:bg-gray-800/50 transition-colors ${
        isActive ? 'bg-gray-800/80 text-white' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTitleClick}
      style={{ fontSize: '13px' }}
    >
      <div className={`flex items-center gap-1 py-1.5 ${isCollapsed ? 'justify-center w-10 mx-auto' : 'px-1.5'}`}>
        {!isCollapsed && hasChildren && (
          <div
            className="w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-gray-800/50 rounded-sm transition-colors"
            onClick={handleArrowClick}
          >
            {node.isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </div>
        )}
        <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} min-w-[16px]`} />
        {!isCollapsed && (
          <span className="ml-1 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {node.text}
          </span>
        )}
      </div>
    </div>
  );
};

const NavTree = ({ nodes, isCollapsed, activeSection, onToggle, onNavigation }) => {
  return (
    <div className="space-y-0">
      {nodes.map((node, index) => (
        <div key={index}>
          <NavItem
            node={node}
            isCollapsed={isCollapsed}
            isActive={node.id === activeSection}
            onToggle={onToggle}
            onNavigation={onNavigation}
          />
          {node.children?.length > 0 && node.isExpanded && !isCollapsed && (
            <div className="ml-2">
              <NavTree
                nodes={node.children}
                isCollapsed={isCollapsed}
                activeSection={activeSection}
                onToggle={onToggle}
                onNavigation={onNavigation}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const SideNavigation = ({ isCollapsed = false, activeSection = '', onNavigation = () => {} }) => {
  const { navTree, toggleNode } = useNav();

  return (
    <nav className={`h-full overflow-y-auto py-1 ${isCollapsed ? 'w-14' : 'w-64'}`}>
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
