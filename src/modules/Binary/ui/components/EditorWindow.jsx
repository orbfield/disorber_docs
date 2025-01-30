import React, { useEffect } from 'react';
import { Settings } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { MotionButton } from '../../../../components/ui/buttons/MotionButton';
import KeyboardControls from '../KeyboardControls';
import TouchControls from '../TouchControls';
import WindowWrapper from '../../../../components/window/WindowWrapper';
import { useWindowManagement } from '../../../../components/window/WindowManagement';

const EditorWindow = ({ 
  streams,
  maxStreams,
  handleAddRandomStream,
  clearStreams,
  blurAmount,
  blurSliderValue,
  adjustBlur,
  colorSliderValue,
  adjustColor,
  zeroColor,
  isTouchDevice,
  orientation,
  addStream
}) => {
  const { registerWindow } = useWindowManagement();
  const windowId = 'editor';

  useEffect(() => {
    registerWindow(windowId, { width: 350, height: 500 }, 'editor');
  }, [registerWindow]);

  return (
    <WindowWrapper 
      id={windowId}
      title="Controls" 
      icon={Settings}
  >
    <div className="space-y-4">
      <div className="flex gap-2">
        <MotionButton
          text={streams.length >= maxStreams ? "Replace Random" : "Add Random"}
          onClick={handleAddRandomStream}
          variant="top"
          className="flex-1"
        />
        <MotionButton 
          text="Clear"
          onClick={clearStreams}
          variant="top"
          className="bg-red-500/10 text-red-400"
        />
      </div>

      <AnimatePresence>
        {!isTouchDevice && (
          <div className="border-t border-cyan-500/10 pt-4">
            <KeyboardControls onAddStream={addStream} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTouchDevice && (
          <div className="border-t border-cyan-500/10 pt-4">
            <TouchControls orientation={orientation} onAddStream={addStream} />
          </div>
        )}
      </AnimatePresence>

      <div className="border-t border-cyan-500/10 pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-cyan-400/70">Glass Effect:</span>
          <span className="text-sm text-cyan-400/70 w-16 text-right">
            {blurAmount.toFixed(2)}px
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={blurSliderValue}
            onChange={(e) => adjustBlur(Number(e.target.value))}
            className="w-full h-2 bg-cyan-500/10 rounded-lg appearance-none cursor-pointer accent-cyan-400
                      [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                      [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400
                      [&::-moz-range-thumb]:border-none"
          />
        </div>
        <div className="flex justify-between px-1">
          <span className="text-[10px] text-cyan-400/50">Clear</span>
          <span className="text-[10px] text-cyan-400/50">Blurred</span>
        </div>
      </div>

      <div className="border-t border-cyan-500/10 pt-4 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-cyan-400/70">Zero Color:</span>
          <span className="text-sm w-16 text-right" style={{ color: zeroColor }}>
            {Math.round((colorSliderValue / 100) * 360)}°
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full">
            <div 
              className="absolute inset-0 rounded-lg h-2"
              style={{
                background: 'linear-gradient(to right, hsl(180, 70%, 60%), hsl(240, 70%, 60%), hsl(300, 70%, 60%))'
              }}
            />
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={colorSliderValue}
              onChange={(e) => adjustColor(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-transparent
                        [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:shadow-md
                        
                        [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                        [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400
                        [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:relative
                        [&::-moz-range-thumb]:z-10 [&::-moz-range-thumb]:shadow-md
                        [&::-moz-range-thumb]:translate-y-[-2px]"
            />
          </div>
        </div>
      </div>
    </div>
  </WindowWrapper>
  );
};

export default EditorWindow;
