import React, { useCallback } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useWindowManagement } from './WindowManagement';


const DraggableTitle = ({ id, icon: Icon, title, onDragEnd }) => {
  return (
    <DndContext onDragEnd={onDragEnd}>
      <DraggableComponent id={id} icon={Icon} title={title} />
    </DndContext>
  );
};

const DraggableComponent = ({ id, icon: Icon, title }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="bg-gray-700/40 border-b border-cyan-500/20 px-2 py-1 cursor-move select-none backdrop-blur-sm"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-cyan-400/90" />
        <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400/90">{title}</h3>
      </div>
    </div>
  );
};

const Window = ({ children, position, dimensions }) => {
  const style = {
    position: 'absolute',
    width: dimensions.width,
    height: dimensions.height,
    left: position.x,
    top: position.y,
    touchAction: 'none'
  };

  return (
    <div style={style} className="select-none">
      {children}
    </div>
  );
};

const WindowWrapper = ({
  children,
  title,
  icon: Icon,
  id = 'window',
}) => {
  const { windows, updateWindowPosition } = useWindowManagement();
  const windowData = windows.get(id);
  
  if (!windowData) {
    return null; // Don't render until window is registered
  }

  const { position, size } = windowData;

  const handleDragEnd = useCallback((event) => {
    if (!event.delta) return;
    const { x: deltaX, y: deltaY } = event.delta;
    updateWindowPosition(id, {
      x: position.x + deltaX,
      y: position.y + deltaY
    });
  }, [id, position.x, position.y, updateWindowPosition]);

  return (
    <Window
      position={position}
      dimensions={size}
    >
      <div className="bg-gray-800/70 backdrop-blur-lg border border-cyan-500/20 h-full flex flex-col shadow-lg" style={{ width: size.width, height: size.height }}>
        <DraggableTitle id={id} icon={Icon} title={title} onDragEnd={handleDragEnd} />
        <div className="p-3 flex-1">
          {children}
        </div>
      </div>
    </Window>
  );
};

export default WindowWrapper;
