import React, { useMemo } from 'react';

const BinaryBackground = ({ isCollapsed }) => {
  const patterns = [
    "0  0 00  00 0  0 ",
    " 00 0  00  0 00  ",
    "  0000  00    000",
    "00    00  0000   ",
    " 0 00 0 0 0  0 0 ",
    "0 0  0 0 0 00 0 0",
    "    0000    0000 ",
    "0000    0000    0"
  ];
  
  // Increase columns for higher density
  const columns = 0;
  
  // Memoize the column configurations to prevent recalculation on re-renders
  const columnConfigs = useMemo(() => {
    return [...Array(columns)].map((_, columnIndex) => {
      const pattern = patterns[columnIndex % patterns.length];
      const basePosition = (columnIndex / columns) * 100;
      const offset = (Math.random() - 0.1) * 5; // Random offset between -1 and 1
      const leftPosition = `${basePosition + offset}%`;
      
      // Create variation in speeds but keep them close enough for visual coherence
      const speed = 44 + Math.random() * 22; // Speed between 12-16s
      const delay = Math.random() * -16; // Smaller delay range for better distribution
      
      // Repeat the pattern enough times to cover full height
      const repeatedPattern = pattern.repeat(8);
      
      return {
        leftPosition,
        speed,
        delay,
        pattern: repeatedPattern
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen">
      <div className="relative w-full h-full">
        {columnConfigs.map((config, columnIndex) => (
          <div
            key={columnIndex}
            className="absolute flex flex-col items-center"
            style={{
              left: config.leftPosition,
              animation: `binaryFall ${config.speed}s linear infinite`,
              animationDelay: `${config.delay}s`,
            }}
          >
            {config.pattern.split("").map((bit, bitIndex) => (
              <div
                key={bitIndex}
                className="text-cyan-500/10 font-mono text-[15px] leading-tight"
              >
                {bit}
              </div>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes binaryFall {
          from {
            transform: translateY(-100vh);
          }
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default BinaryBackground;
