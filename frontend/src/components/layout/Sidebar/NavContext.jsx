import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const NavContext = createContext(null);

export const NavProvider = ({ children, initialTree = [] }) => {
  const [originalTree, setOriginalTree] = useState(initialTree);
  const [navTree, setNavTree] = useState(initialTree);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (initialTree?.length > 0) {
      setOriginalTree([...initialTree]);
      setNavTree([...initialTree]);
    }
  }, [initialTree]);

  const searchNodes = useCallback((nodes, term) => {
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
  }, []);

  const resetExpansion = useCallback((nodes) => {
    if (!Array.isArray(nodes)) return [];
    
    return nodes.map(node => ({
      ...node,
      isExpanded: false,
      children: node.children ? resetExpansion(node.children) : []
    }));
  }, []);

  const updateSearch = useCallback((term) => {
    setSearchTerm(term);
    
    try {
      if (!term) {
        setNavTree(prevTree => resetExpansion(prevTree));
        return;
      }
      
      setNavTree(() => {
        const searchResult = searchNodes(originalTree, term)
          .filter(node => node.matches || node.children?.some(child => child.matches));
        return searchResult;
      });
    } catch (error) {
      console.error('Error updating search:', error);
    }
  }, [originalTree, searchNodes, resetExpansion]);

  const toggleNode = useCallback((targetNode) => {
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
      setNavTree(prevNavTree => updateNodes(prevNavTree));
      setOriginalTree(prevOriginalTree => updateNodes(prevOriginalTree));
    } catch (error) {
      console.error('Error toggling node:', error);
    }
  }, []);

  return (
    <NavContext.Provider value={{ navTree, searchTerm, updateSearch, toggleNode }}>
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

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};