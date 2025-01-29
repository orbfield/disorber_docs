import React, { memo } from 'react';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { WindowWrapper } from '../WindowWrapper';
import { useWindowContext } from '../WindowContext';
import KeyboardControls from '../KeyboardControls';
import TouchControls from '../TouchControls';

const DEFAULT_POSITION = { x: 400, y: 100 };

export const Trace = ({ 
  id = 'trace',
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
  addStream,
  initialPosition = DEFAULT_POSITION
}) => {
  const { toggleWindowVisibility } = useWindowContext();

  return (
    <WindowWrapper
      id={id}
      initialPosition={initialPosition}
      className="bg-gray-800/70 backdrop-blur-lg border border-cyan-500/20 h-full flex flex-col shadow-lg"
    >
      {/* Window Header */}
      <div 
        className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900 flex-t-lg"
        style={{ cursor: 'move' }}
      >
        <div className="flex items-center gap-2 px-2">
          <Settings className="w-4 h-4 text-cyan-500" />
          <h2 className="text-white font-semibold">Controls</h2>
        </div>
        <button
          onClick={() => toggleWindowVisibility(id)}
          className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center flex-lg hover:bg-gray-700"
        >
          ×
        </button>
      </div>

      {/* Window Content */}
      <div className="h-full flex flex-col">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-lg bg-black/50 border border-cyan-500/10 p-3 max-h-[400px] overflow-y-auto"
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <motion.button
                onClick={handleAddRandomStream}
                className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {streams.length >= maxStreams ? "Replace Random" : "Add Random"}
              </motion.button>
              <motion.button
                onClick={clearStreams}
                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear
              </motion.button>
            </div>

            {!isTouchDevice && (
              <div className="border-t border-cyan-500/10 pt-4">
                <KeyboardControls onAddStream={addStream} />
              </div>
            )}

            {isTouchDevice && (
              <div className="border-t border-cyan-500/10 pt-4">
                <TouchControls orientation={orientation} onAddStream={addStream} />
              </div>
            )}

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
        </motion.div>
        <div className="text-center mt-2">
          <span className="text-xs text-cyan-400/50">disorber.com</span>
        </div>
      </div>
    </WindowWrapper>
  );
};
