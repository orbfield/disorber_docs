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
      console.log('NavProvider: initialTree updated', initialTree);
      setOriginalTree(initialTree);
      setNavTree(initialTree);
    }
  }, [initialTree]);

  // Log initial tree when component mounts
  useEffect(() => {
    console.group('NavProvider Initialization');
    console.log('Initial tree received:', initialTree);
    console.log('Tree structure:', JSON.stringify(initialTree, null, 2));
    console.groupEnd();
  }, [initialTree]);

  // Monitor tree changes
  useEffect(() => {
    console.group('NavTree Update');
    console.log('Current navTree:', navTree);
    console.log('Original tree:', originalTree);
    console.groupEnd();
  }, [navTree, originalTree]);

  const searchNodes = (nodes, term) => {
    console.group('Searching Nodes');
    console.log('Search term:', term);
    console.log('Nodes to search:', nodes);

    const result = nodes.map(node => {
      const newNode = {
        ...node,
        children: node.children ? [...node.children] : [],
        isExpanded: node.isExpanded
      };
     
      const matches = node.text.toLowerCase().includes(term.toLowerCase());
      console.log(`Node "${node.text}" matches:`, matches);
     
      if (newNode.children.length > 0) {
        newNode.children = searchNodes(newNode.children, term).filter(child => {
          const keepChild = child.matches || child.children?.some(c => c.matches);
          console.log(`Child "${child.text}" keep:`, keepChild);
          return keepChild;
        });
       
        const hasMatchingChildren = newNode.children.length > 0;
        newNode.isExpanded = term !== '' && (matches || hasMatchingChildren);
      }

      newNode.matches = matches;
     
      if (matches && term !== '') {
        newNode.isExpanded = true;
      }

      console.log(`Processed node "${node.text}":`, {
        matches,
        isExpanded: newNode.isExpanded,
        childrenCount: newNode.children.length
      });

      return newNode;
    });

    console.groupEnd();
    return result;
  };

  const updateSearch = (term) => {
    console.group('Updating Search');
    console.log('New search term:', term);
    
    setSearchTerm(term);
    if (term === '') {
      console.log('Resetting to original tree');
      setNavTree(resetExpansion(originalTree));
    } else {
      const searchResult = searchNodes(originalTree, term).filter(node =>
        node.matches || node.children?.some(child => child.matches)
      );
      console.log('Search results:', searchResult);
      setNavTree(searchResult);
    }
    console.groupEnd();
  };

  const resetExpansion = (nodes) => {
    console.log('Resetting expansion state');
    return nodes.map(node => ({
      ...node,
      isExpanded: false,
      children: node.children ? resetExpansion(node.children) : []
    }));
  };

  const toggleNode = (targetNode) => {
    console.group('Toggling Node');
    console.log('Target node:', targetNode);

    const updateNodes = (nodes) => {
      return nodes.map(node => {
        if (node.id === targetNode.id) {
          console.log(`Toggling node "${node.text}"`);
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
    
    console.log('Updated nav tree:', newNavTree);
    setNavTree(newNavTree);
    setOriginalTree(newOriginalTree);
    console.groupEnd();
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
