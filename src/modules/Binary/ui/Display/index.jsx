import React, { memo, useMemo } from 'react';
import { Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { WindowWrapper } from '../WindowWrapper';
import { useWindowContext } from '../WindowContext';

const DEFAULT_POSITION = { x: 100, y: 100 };

const BinaryDigit = memo(({ digit, zeroColor }) => (
  <span style={{ color: digit === '0' ? zeroColor : '#4B5563' }}>
    {digit}
  </span>
));

const BinaryStreamLine = memo(({ stream, lineLength, zeroColor }) => {
  const pattern = stream.getPattern(lineLength);
  const duration = stream.getAnimationDuration();

  return (
    <div className="relative h-[1.2em] overflow-hidden">
      <style jsx>{`
        @keyframes scrollBinary {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      {[0, 1].map(idx => (
        <div
          key={idx}
          className="absolute whitespace-pre"
          style={{
            transform: `translateX(${idx * 100}%)`,
            animation: `scrollBinary ${duration}s linear infinite`,
            animationDelay: `${-idx * duration}s`,
            willChange: 'transform'
          }}
        >
          {pattern.split('').map((digit, i) => (
            <BinaryDigit key={i} digit={digit} zeroColor={zeroColor} />
          ))}
        </div>
      ))}
    </div>
  );
});

export const Display = ({ 
  id = 'display',
  streams = [],
  lineLength = 32,
  blurAmount = 0,
  zeroColor = '#00ff00',
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
        className="bg-gray-700/40 border-b border-cyan-500/20 px-2 py-1 cursor-move select-none backdrop-blur-sm"
        style={{ cursor: 'move' }}
      >
        <div className="flex items-center gap-2 px-2">
          <Monitor className="w-4 h-4 text-cyan-500" />
          <h2 className="text-white font-semibold">Display</h2>
        </div>
        <button
          onClick={() => toggleWindowVisibility(id)}
          className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700"
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
          className="rounded-lg bg-black/50 border border-cyan-500/10 p-3"
        >
          <div
            style={{
              fontFamily: 'Consolas, monospace',
              whiteSpace: 'pre',
              lineHeight: 1,
              fontSize: '14px',
              letterSpacing: 0,
              fontFeatureSettings: '"zero" 1, "calt" 0',
              filter: `blur(${blurAmount}px)`,
              transition: 'all 0.1s ease-out'
            }}
            className="text-white overflow-hidden space-y-0"
          >
            {streams.map((stream, idx) => (
              <BinaryStreamLine
                key={`${stream.key}-${idx}`}
                stream={stream}
                lineLength={lineLength}
                zeroColor={zeroColor}
              />
            ))}
          </div>
        </motion.div>
        <div className="text-center mt-2">
          <span className="text-xs text-cyan-400/50">disorber.com</span>
        </div>
      </div>
    </WindowWrapper>
  );
};

// Example usage:
/*
<WindowProvider>
  <DisplayWindow
    id="my-window"
    title="My Window"
    content={<div>Window content goes here</div>}
    initialPosition={{ x: 200, y: 150 }}
    width={400}
    height={300}
  />
</WindowProvider>
*/
