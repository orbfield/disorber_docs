import React, { useEffect } from 'react';
import { Play, Pause, Plus, Minus, Monitor, LineChart, Layers } from 'lucide-react';
import { MotionButton } from '../../../../components/ui/buttons/MotionButton';
import WindowWrapper from '../../../../components/window/WindowWrapper';
import { useWindowManagement } from '../../../../components/window/WindowManagement';

const WorkspaceWindow = ({ 
  isRunning, 
  speed, 
  adjustSpeed, 
  toggleRunning,
  lineLength,
  adjustLineLength,
  maxStreams,
  adjustMaxStreams
}) => {
  const { registerWindow } = useWindowManagement();
  const windowId = 'workspace';

  useEffect(() => {
    registerWindow(windowId, { width: 350, height: 500 }, 'workspace');
  }, [registerWindow]);

  return (
    <WindowWrapper 
      id={windowId}
      title="Workspace" 
      icon={Monitor}
      isResizable={false}
    >
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <MotionButton
          icon={isRunning ? Pause : Play}
          onClick={toggleRunning}
          variant="top"
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <MotionButton
            icon={Minus}
            onClick={() => adjustSpeed(-10)}
            variant="top"
            className="!p-2"
          />
          <span className="py-1 px-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm min-w-[60px] text-center">
            {speed}ms
          </span>
          <MotionButton
            icon={Plus}
            onClick={() => adjustSpeed(10)}
            variant="top"
            className="!p-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <LineChart className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400">Length:</span>
          <div className="flex items-center gap-2">
            <MotionButton
              icon={Minus}
              onClick={() => adjustLineLength(-10)}
              variant="top"
              className="!p-2"
            />
            <span className="py-1 px-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm min-w-[60px] text-center">
              {lineLength}
            </span>
            <MotionButton
              icon={Plus}
              onClick={() => adjustLineLength(10)}
              variant="top"
              className="!p-2"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400">Streams:</span>
          <div className="flex items-center gap-2">
            <MotionButton
              icon={Minus}
              onClick={() => adjustMaxStreams(-1)}
              variant="top"
              className="!p-2"
            />
            <span className="py-1 px-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm min-w-[60px] text-center">
              {maxStreams}
            </span>
            <MotionButton
              icon={Plus}
              onClick={() => adjustMaxStreams(1)}
              variant="top"
              className="!p-2"
            />
          </div>
        </div>
      </div>
    </div>
  </WindowWrapper>
  );
};

export default WorkspaceWindow;
