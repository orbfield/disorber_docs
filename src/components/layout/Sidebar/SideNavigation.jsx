import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Image, Binary, BookOpen, Settings, Folder, ChevronRight, ChevronDown, Play } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNav } from './NavContext';

/**
 * @typedef {Object} NavigationNode
 * @property {string} id - Unique identifier for the node
 * @property {string} text - Display text for the node
 * @property {string} [icon] - Icon name from the icons object
 * @property {string} [path] - Navigation path
 * @property {string} [type] - Node type (e.g., 'gif')
 * @property {boolean} [isExpanded] - Whether the node is expanded
 * @property {NavigationNode[]} [children] - Child nodes
 */

/** @type {Object.<string, React.ComponentType>} */
const icons = {
  Home,
  Image,
  Binary,
  BookOpen,
  Settings,
  Folder,
  Play
};

/**
 * Navigation item component that renders a single node in the navigation tree
 * @param {Object} props
 * @param {NavigationNode} props.node - Navigation node to render
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed
 * @param {boolean} props.isActive - Whether this node is currently active
 * @param {(node: NavigationNode) => void} props.onToggle - Function to toggle node expansion
 */
const NavItem = ({ node, isCollapsed, isActive, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = icons[node.icon] || icons.Folder;
  const hasChildren = node.children?.length > 0;

  const navigate = useNavigate();
  
  const handleArrowClick = (e) => {
    e.stopPropagation();
    onToggle(node);
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    
    try {
      if (node.id) {
        const navigationPath = node.type === 'gif' 
          ? `/gallery/${node.path}`
          : node.id === "home" ? "/" : `/${node.path || node.id}`;
        
        navigate(navigationPath);
        
        if (hasChildren && !node.isExpanded) {
          onToggle(node);
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
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

/**
 * Recursive component that renders a tree of navigation nodes
 * @param {Object} props
 * @param {NavigationNode[]} props.nodes - Array of navigation nodes
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed
 * @param {string} props.activeSection - ID of the currently active section
 * @param {(node: NavigationNode) => void} props.onToggle - Function to toggle node expansion
 */
const NavTree = ({ nodes, isCollapsed, activeSection, onToggle }) => {
  return (
    <div className="space-y-0">
      {nodes.map((node, index) => (
        <div key={index}>
          <NavItem
            node={node}
            isCollapsed={isCollapsed}
            isActive={node.id === activeSection}
            onToggle={onToggle}
          />
          {node.children?.length > 0 && node.isExpanded && !isCollapsed && (
            <div className="ml-2">
              <NavTree
                nodes={node.children}
                isCollapsed={isCollapsed}
                activeSection={activeSection}
                onToggle={onToggle}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Main navigation component that renders the entire navigation sidebar
 * @param {Object} props
 * @param {boolean} [props.isCollapsed=false] - Whether the sidebar is collapsed
 * @param {string} [props.activeSection=''] - ID of the currently active section
 */
const SideNavigation = ({ isCollapsed = false, activeSection = '' }) => {
  const { navTree, toggleNode } = useNav();

  return (
    <nav className={`h-full overflow-y-auto py-1 ${isCollapsed ? 'w-14' : 'w-64'}`}>
      <NavTree
        nodes={navTree}
        isCollapsed={isCollapsed}
        activeSection={activeSection}
        onToggle={toggleNode}
      />
    </nav>
  );
};

NavItem.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string,
    path: PropTypes.string,
    type: PropTypes.string,
    isExpanded: PropTypes.bool,
    children: PropTypes.array
  }).isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

NavTree.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string.isRequired,
      children: PropTypes.array,
      isExpanded: PropTypes.bool
    })
  ).isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  activeSection: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired
};

SideNavigation.propTypes = {
  isCollapsed: PropTypes.bool,
  activeSection: PropTypes.string
};

export default SideNavigation;
