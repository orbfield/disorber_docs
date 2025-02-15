import { DndContext, useDraggable, defaultCoordinates } from '@dnd-kit/core';
import { useZoom } from '../../canvas/ZoomContext';

/**
 * Custom hook that provides drag functionality using dnd-kit
 */
export const useScaledDrag = ({ id, position }) => {
  const { scale } = useZoom();
  
  return useDraggable({
    id,
    data: { position }
  });
};

/**
 * DragProvider component that provides DnD context with scaling support
 */
export const DragProvider = ({ children, onDragEnd }) => {
  const { scale } = useZoom();

  return (
    <DndContext 
      onDragEnd={onDragEnd}
      modifiers={[
        ({ transform }) => ({
          ...transform,
          x: transform.x / scale,
          y: transform.y / scale,
        })
      ]}
    >
      {children}
    </DndContext>
  );
};
