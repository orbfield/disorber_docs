import React, { useEffect, memo, useMemo } from 'react';
import { Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import WindowWrapper from '../../../../components/window/WindowWrapper';
import { useWindowManagement } from '../../../../components/window/WindowManagement';
import { WINDOW_TYPES } from '../../../../components/window/windowConstants';

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

const DisplayWindow = ({ streams, lineLength, blurAmount, zeroColor }) => {
  const { registerWindow, updateWindowSize } = useWindowManagement();
  const windowId = 'display';

  // Register window with type (size will be determined by constraints)
  useEffect(() => {
    registerWindow(windowId, null, WINDOW_TYPES.DISPLAY);
  }, [registerWindow]);

  return (
    <WindowWrapper 
      id={windowId}
      title="Display" 
      icon={Monitor}
    >
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

export default DisplayWindow;
