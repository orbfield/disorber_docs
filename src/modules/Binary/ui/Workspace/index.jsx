import React from 'react';
import { Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { WindowWrapper } from '../WindowWrapper';
import { useWindowContext } from '../WindowContext';

const DEFAULT_POSITION = { x: 700, y: 100 };

export const Workspace = ({ 
  id = 'workspace',
  isRunning,
  speed,
  adjustSpeed,
  toggleRunning,
  lineLength,
  adjustLineLength,
  maxStreams,
  adjustMaxStreams,
  initialPosition = DEFAULT_POSITION
}) => {
  const { toggleWindowVisibility } = useWindowContext();

  return (
    <WindowWrapper
      id={id}
      initialPosition={initialPosition}
      className="bg-gray-800/70 backdrop-blur-lg border border-cyan-500/20 flex-lg shadow-lg"
    >
      {/* Window Header */}
      <div 
        className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900 flex-t-lg"
        style={{ cursor: 'move' }}
      >
        <div className="flex items-center gap-2 px-2">
          <Layout className="w-4 h-4 text-cyan-500" />
          <h2 className="text-white font-semibold">Workspace</h2>
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
          className="flex-lg bg-black/10 border border-cyan-500/10 p-3"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={toggleRunning}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRunning ? (
                  <>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <span>Play</span>
                  </>
                )}
              </motion.button>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => adjustSpeed(-10)}
                  className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  -
                </motion.button>
                <span className="py-1 px-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm min-w-[60px] text-center">
                  {speed}ms
                </span>
                <motion.button
                  onClick={() => adjustSpeed(10)}
                  className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  +
                </motion.button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-cyan-400">Length:</span>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => adjustLineLength(-10)}
                    className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    -
                  </motion.button>
                  <span className="py-1 px-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm min-w-[60px] text-center">
                    {lineLength}
                  </span>
                  <motion.button
                    onClick={() => adjustLineLength(10)}
                    className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-cyan-400">Streams:</span>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => adjustMaxStreams(-1)}
                    className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    -
                  </motion.button>
                  <span className="py-1 px-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm min-w-[60px] text-center">
                    {maxStreams}
                  </span>
                  <motion.button
                    onClick={() => adjustMaxStreams(1)}
                    className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    +
                  </motion.button>
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
