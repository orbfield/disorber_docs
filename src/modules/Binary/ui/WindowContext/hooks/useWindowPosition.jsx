import { useEffect } from 'react';
import { useSidebar } from '../../../../../components/layout/SidebarContext';
import { useWindowContext } from '../index';

const SIDEBAR_WIDTH = 240; // Standard sidebar width in pixels

export const useWindowPosition = (windowId, defaultPosition) => {
  const { isSidebarCollapsed } = useSidebar();
  const { windows, registerWindow, updateWindowPosition } = useWindowContext();

  useEffect(() => {
    // Register window with initial position if not already registered
    if (!windows[windowId]) {
      registerWindow(windowId, defaultPosition);
    }
  }, [windowId, defaultPosition, registerWindow, windows]);

  useEffect(() => {
    const currentWindow = windows[windowId];
    if (!currentWindow) return;

    const offset = isSidebarCollapsed ? -SIDEBAR_WIDTH : 0;
    const newPosition = {
      x: currentWindow.initialPosition.x + offset,
      y: currentWindow.initialPosition.y
    };

    updateWindowPosition(windowId, newPosition);
  }, [isSidebarCollapsed, windowId, windows, updateWindowPosition]);

  return {
    position: windows[windowId]?.position || defaultPosition,
    isVisible: windows[windowId]?.isVisible ?? true,
    zIndex: windows[windowId]?.zIndex ?? 1
  };
};
