import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSidebar } from '../../components/layout/SidebarContext';
import { WINDOW_TYPES, WINDOW_CONSTRAINTS, getWindowTypeConstraints } from './windowConstants';

const WindowManagementContext = createContext();

export const useWindowManagement = () => {
  const context = useContext(WindowManagementContext);
  if (!context) {
    throw new Error('useWindowManagement must be used within WindowManagementProvider');
  }
  return context;
};

export const WindowManagementProvider = ({ children, spacing = 20 }) => {
  const [windows, setWindows] = useState(new Map());
  const { isSidebarCollapsed } = useSidebar();
  const sidebarWidth = isSidebarCollapsed ? 80 : 256;

  const calculateInitialPosition = useCallback((windowType, windowSize) => {
    const constraints = getWindowTypeConstraints(windowType, windowSize, sidebarWidth);
    
    // For DISPLAY type, use the constraints-defined size
    if (windowType === WINDOW_TYPES.DISPLAY) {
      return {
        x: constraints.x,
        y: constraints.y[0],
        size: {
          width: constraints.width,
          height: constraints.height
        }
      };
    }
    
    return {
      x: typeof constraints.x === 'number' ? constraints.x : constraints.x[0],
      y: Array.isArray(constraints.y) ? constraints.y[0] : constraints.y
    };
  }, [sidebarWidth]);

  const registerWindow = useCallback((id, defaultSize, windowType) => {
    if (windowType !== WINDOW_TYPES.WORKSPACE && 
        windowType !== WINDOW_TYPES.EDITOR && 
        windowType !== WINDOW_TYPES.DISPLAY) {
      console.warn('Only specific window types (WORKSPACE, EDITOR, DISPLAY) are supported');
      return;
    }
    
    setWindows(prev => {
      const newWindows = new Map(prev);
      if (!newWindows.has(id)) {
        const initialState = calculateInitialPosition(windowType, defaultSize);
        newWindows.set(id, {
          position: {
            x: initialState.x,
            y: initialState.y
          },
          size: windowType === WINDOW_TYPES.DISPLAY ? initialState.size : defaultSize,
          type: windowType
        });
      }
      return newWindows;
    });
  }, [calculateInitialPosition]);

  const constrainPosition = useCallback((position, windowData) => {
    const constraints = getWindowTypeConstraints(windowData.type, windowData.size, sidebarWidth);
    
    let x = position.x;
    let y = position.y;
    
    // Apply x constraints
    if (typeof constraints.x === 'number') {
      x = constraints.x;
    } else {
      x = Math.max(constraints.x[0], Math.min(x, constraints.x[1]));
    }
    
    // Apply y constraints
    y = Math.max(constraints.y[0], Math.min(y, constraints.y[1]));
    
    return { x, y };
  }, [sidebarWidth]);

  const updateWindowPosition = useCallback((id, position) => {
    setWindows(prev => {
      const newWindows = new Map(prev);
      const windowData = newWindows.get(id);
      if (windowData) {
        const constrainedPosition = constrainPosition(position, windowData);
        newWindows.set(id, { ...windowData, position: constrainedPosition });
      }
      return newWindows;
    });
  }, [constrainPosition]);

  const updateWindowSize = useCallback((id, size) => {
    setWindows(prev => {
      const newWindows = new Map(prev);
      const windowData = newWindows.get(id);
      if (windowData) {
        newWindows.set(id, { ...windowData, size });
      }
      return newWindows;
    });
  }, []);

  const recalculatePositions = useCallback(() => {
    setWindows(prev => {
      const newWindows = new Map();
      prev.forEach((data, id) => {
        const position = calculateInitialPosition(data.type, data.size);
        newWindows.set(id, { ...data, position });
      });
      return newWindows;
    });
  }, [calculateInitialPosition]);

  useEffect(() => {
    window.addEventListener('resize', recalculatePositions);
    return () => window.removeEventListener('resize', recalculatePositions);
  }, [recalculatePositions]);

  useEffect(() => {
    recalculatePositions();
  }, [isSidebarCollapsed, recalculatePositions]);

  return (
    <WindowManagementContext.Provider 
      value={{ 
        windows,
        registerWindow,
        updateWindowPosition,
        updateWindowSize,
        constrainPosition
      }}
    >
      {children}
    </WindowManagementContext.Provider>
  );
};
