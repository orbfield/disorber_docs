import React, { createContext, useContext, useState, useEffect } from 'react';
import { scanPagesDirectory } from './utils/pageScanner';

const NavContext = createContext();

export const NavProvider = ({ children }) => {
  const [originalTree, setOriginalTree] = useState([]);
  const [navTree, setNavTree] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadNavTree = async () => {
      try {
        const tree = await scanPagesDirectory();
        setOriginalTree(tree);
        setNavTree(tree);
      } catch (error) {
        console.error('Failed to load navigation tree:', error);
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

  const searchNodes = (nodes, term) => {
    return nodes.map(node => {
      // Deep clone the node to preserve all properties
      const newNode = {
        ...node,
        children: node.children ? [...node.children] : [],
        isExpanded: node.isExpanded
      };
      
      // Check if the current node matches the search term
      const matches = node.text.toLowerCase().includes(term.toLowerCase());
      
      // Recursively search children if they exist
      if (newNode.children.length > 0) {
        newNode.children = searchNodes(newNode.children, term).filter(child => {
          // Keep child if it matches or has matching descendants
          return child.matches || child.children?.some(c => c.matches);
        });
        
        // A node should be expanded if it has matching children
        const hasMatchingChildren = newNode.children.length > 0;
        newNode.isExpanded = term !== '' && (matches || hasMatchingChildren);
      }

      // Mark if this node matches for parent filtering
      newNode.matches = matches;
      
      // If this node matches the search term, it should be expanded
      if (matches && term !== '') {
        newNode.isExpanded = true;
      }

      return newNode;
    });
  };

  const updateSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      // Reset to original tree
      setNavTree(resetExpansion(originalTree));
    } else {
      // Filter the root level to only show nodes that match or have matching descendants
      const searchResult = searchNodes(originalTree, term).filter(node => 
        node.matches || node.children?.some(child => child.matches)
      );
      console.log('Search result:', searchResult); // Debug log
      setNavTree(searchResult);
    }
  };

  const resetExpansion = (nodes) => {
    return nodes.map(node => ({
      ...node,
      isExpanded: false,
      children: node.children ? resetExpansion(node.children) : []
    }));
  };

  const toggleNode = (targetNode) => {
    const updateNodes = (nodes) => {
      return nodes.map(node => {
        // Compare by id instead of reference
        if (node.id === targetNode.id) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children?.length) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    
    // Update both trees to maintain expansion state
    setNavTree(updateNodes(navTree));
    setOriginalTree(updateNodes(originalTree));
  };

  return (
    <NavContext.Provider value={{
      navTree,
      searchTerm,
      updateSearch,
      toggleNode
    }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};
