import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} NavNode
 * @property {string} id - Unique identifier for the node
 * @property {string} text - Display text for the node
 * @property {NavNode[]} [children] - Child nodes
 * @property {boolean} [isExpanded] - Whether the node is expanded
 * @property {boolean} [matches] - Whether the node matches search criteria
 */

/**
 * @typedef {Object} NavContextValue
 * @property {NavNode[]} navTree - Current navigation tree
 * @property {string} searchTerm - Current search term
 * @property {(term: string) => void} updateSearch - Function to update search
 * @property {(node: NavNode) => void} toggleNode - Function to toggle node expansion
 */

const NavContext = createContext(null);

/**
 * Provider component for navigation context
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {NavNode[]} [props.initialTree=[]] - Initial navigation tree
 */
export const NavProvider = ({ children, initialTree = [] }) => {
  const [originalTree, setOriginalTree] = useState(initialTree);
  const [navTree, setNavTree] = useState(initialTree);
  const [searchTerm, setSearchTerm] = useState('');

  // Update trees when initialTree changes
  useEffect(() => {
    if (initialTree && initialTree.length > 0) {
      setOriginalTree(initialTree);
      setNavTree(initialTree);
    }
  }, [initialTree]);

  /**
   * Recursively searches through nodes and updates their state based on search term
   * @param {NavNode[]} nodes - Array of navigation nodes to search through
   * @param {string} term - Search term to match against
   * @returns {NavNode[]} Updated array of nodes with search results
   */
  const searchNodes = (nodes, term) => {
    const normalizedTerm = term.toLowerCase();
    
    return nodes.map(node => {
      const newNode = {
        ...node,
        children: node.children ? [...node.children] : [],
        isExpanded: node.isExpanded
      };
      
      const matches = node.text.toLowerCase().includes(normalizedTerm);
      
      if (newNode.children.length > 0) {
        newNode.children = searchNodes(newNode.children, term)
          .filter(child => child.matches || child.children?.some(c => c.matches));
        
        newNode.isExpanded = term !== '' && (matches || newNode.children.length > 0);
      }
      
      newNode.matches = matches;
      if (matches && term !== '') {
        newNode.isExpanded = true;
      }
      
      return newNode;
    });
  };

  /**
   * Updates the navigation tree based on search term
   * @param {string} term - Search term to filter nodes
   */
  const updateSearch = (term) => {
    setSearchTerm(term);
    
    try {
      if (!term) {
        setNavTree(resetExpansion(originalTree));
        return;
      }
      
      const searchResult = searchNodes(originalTree, term)
        .filter(node => node.matches || node.children?.some(child => child.matches));
      setNavTree(searchResult);
    } catch (error) {
      console.error('Error updating search:', error);
      setNavTree(originalTree); // Fallback to original tree on error
    }
  };

  /**
   * Resets expansion state of all nodes
   * @param {NavNode[]} nodes - Array of nodes to reset
   * @returns {NavNode[]} Nodes with reset expansion state
   */
  const resetExpansion = (nodes) => {
    if (!Array.isArray(nodes)) return [];
    
    return nodes.map(node => ({
      ...node,
      isExpanded: false,
      children: node.children ? resetExpansion(node.children) : []
    }));
  };

  /**
   * Toggles expansion state of a specific node
   * @param {NavNode} targetNode - Node to toggle
   */
  const toggleNode = (targetNode) => {
    if (!targetNode?.id) {
      console.error('Invalid node provided to toggleNode');
      return;
    }

    const updateNodes = (nodes) => {
      return nodes.map(node => {
        if (node.id === targetNode.id) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children?.length) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };

    try {
      const newNavTree = updateNodes(navTree);
      const newOriginalTree = updateNodes(originalTree);
      
      setNavTree(newNavTree);
      setOriginalTree(newOriginalTree);
    } catch (error) {
      console.error('Error toggling node:', error);
    }
  };

  const contextValue = {
    navTree,
    searchTerm,
    updateSearch,
    toggleNode
  };

  return (
    <NavContext.Provider value={contextValue}>
      {children}
    </NavContext.Provider>
  );
};

NavProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialTree: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    children: PropTypes.array,
    isExpanded: PropTypes.bool,
    matches: PropTypes.bool
  }))
};

/**
 * Custom hook to access navigation context
 * @returns {NavContextValue} Navigation context value
 * @throws {Error} If used outside of NavProvider
 */
export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};
