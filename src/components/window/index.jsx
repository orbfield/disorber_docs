import React, { createContext, useContext, useState, useCallback } from 'react';

const WindowContext = createContext();

// Re-export the hook for easier imports
export * from './hooks/useWindowPosition';

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
};

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState({});

  const registerWindow = useCallback((id, initialPosition) => {
    setWindows(prev => {
      // Only register if window doesn't exist
      if (prev[id]) return prev;
      
      return {
        ...prev,
        [id]: {
          position: initialPosition,
          initialPosition,
          isVisible: true,
          zIndex: Object.keys(prev).length + 1
        }
      };
    });
  }, []);

  const updateWindowPosition = useCallback((id, position) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        position
      }
    }));
  }, []);

  const toggleWindowVisibility = useCallback((id) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isVisible: !prev[id]?.isVisible
      }
    }));
  }, []);

  const bringToFront = useCallback((id) => {
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map(w => w.zIndex));
      return {
        ...prev,
        [id]: {
          ...prev[id],
          zIndex: maxZ + 1
        }
      };
    });
  }, []);

  const value = {
    windows,
    registerWindow,
    updateWindowPosition,
    toggleWindowVisibility,
    bringToFront
  };

  return (
    <WindowContext.Provider value={value}>
      {children}
    </WindowContext.Provider>
  );
};
