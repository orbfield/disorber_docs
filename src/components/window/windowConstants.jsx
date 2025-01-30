import { StreamManager } from '../../modules/Binary/core/streamManager';

export const WINDOW_TYPES = {
  WORKSPACE: 'workspace',
  EDITOR: 'editor',
  DISPLAY: 'display'
};

export const WINDOW_CONSTRAINTS = {
  MIN_WIDTH: 280,
  MIN_HEIGHT: 120,
  TOP_MARGIN: 100,
  SIDE_SPACING: 20,
  DISPLAY: {
    WIDTH: StreamManager.LINE_LENGTH * 8.1, // Each character is roughly 20px wide
    HEIGHT: StreamManager.MAX_STREAMS * 14 // Each character is roughly 24px tall
  }
};

export const getWindowTypeConstraints = (windowType, size, sidebarWidth) => {
  const { innerWidth, innerHeight } = window;
  
  switch (windowType) {
    case WINDOW_TYPES.WORKSPACE:
      return {
        x: sidebarWidth + WINDOW_CONSTRAINTS.SIDE_SPACING,
        y: [WINDOW_CONSTRAINTS.TOP_MARGIN, innerHeight - size.height]
      };
    case WINDOW_TYPES.EDITOR:
      return {
        x: innerWidth - size.width - WINDOW_CONSTRAINTS.SIDE_SPACING,
        y: [WINDOW_CONSTRAINTS.TOP_MARGIN, innerHeight - size.height]
      };
    case WINDOW_TYPES.DISPLAY:
      return {
        x: ((innerWidth - WINDOW_CONSTRAINTS.DISPLAY.WIDTH) / 2) + (sidebarWidth / 2),
        y: [WINDOW_CONSTRAINTS.TOP_MARGIN, innerHeight - WINDOW_CONSTRAINTS.DISPLAY.HEIGHT],
        width: WINDOW_CONSTRAINTS.DISPLAY.WIDTH,
        height: WINDOW_CONSTRAINTS.DISPLAY.HEIGHT
      };
    default:
      return {
        x: [sidebarWidth + WINDOW_CONSTRAINTS.SIDE_SPACING, innerWidth - size.width - WINDOW_CONSTRAINTS.SIDE_SPACING],
        y: [WINDOW_CONSTRAINTS.TOP_MARGIN, innerHeight - size.height]
      };
  }
};
