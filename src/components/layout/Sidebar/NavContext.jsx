// NavProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const NavContext = createContext();

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

  const searchNodes = (nodes, term) => {

    const result = nodes.map(node => {
      const newNode = {
        ...node,
        children: node.children ? [...node.children] : [],
        isExpanded: node.isExpanded
      };
     
      const matches = node.text.toLowerCase().includes(term.toLowerCase());
     
      if (newNode.children.length > 0) {
        newNode.children = searchNodes(newNode.children, term).filter(child => {
          const keepChild = child.matches || child.children?.some(c => c.matches);
          return keepChild;
        });
       
        const hasMatchingChildren = newNode.children.length > 0;
        newNode.isExpanded = term !== '' && (matches || hasMatchingChildren);
      }

      newNode.matches = matches;
     
      if (matches && term !== '') {
        newNode.isExpanded = true;
      }


      return newNode;
    });

    return result;
  };

  const updateSearch = (term) => {
    
    setSearchTerm(term);
    if (term === '') {
      setNavTree(resetExpansion(originalTree));
    } else {
      const searchResult = searchNodes(originalTree, term).filter(node =>
        node.matches || node.children?.some(child => child.matches)
      );
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
        if (node.id === targetNode.id) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children?.length) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
   
    const newNavTree = updateNodes(navTree);
    const newOriginalTree = updateNodes(originalTree);
    
    setNavTree(newNavTree);
    setOriginalTree(newOriginalTree);
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
