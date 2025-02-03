import { useEffect } from 'react';
import { useSidebar } from '../../layout/SidebarContext';
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

    // Calculate the difference in sidebar width
    const previousOffset = isSidebarCollapsed ? 0 : SIDEBAR_WIDTH;
    const newOffset = isSidebarCollapsed ? -SIDEBAR_WIDTH : 0;
    const offsetDiff = newOffset - previousOffset;

    // Update position relative to current position, not initial position
    const newPosition = {
      x: currentWindow.position.x + offsetDiff,
      y: currentWindow.position.y
    };

    updateWindowPosition(windowId, newPosition);
  }, [isSidebarCollapsed, windowId, windows, updateWindowPosition]);

  return {
    position: windows[windowId]?.position || defaultPosition,
    isVisible: windows[windowId]?.isVisible ?? true,
    zIndex: windows[windowId]?.zIndex ?? 1
  };
};
