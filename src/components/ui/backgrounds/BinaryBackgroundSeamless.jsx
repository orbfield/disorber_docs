import React, { useMemo } from 'react';

const BinaryBackgroundSeamless = ({ isCollapsed }) => {
  const patterns = [
    "01101001100101101",
    "10010110011010011",
    "11000011001111000",
    "00111100110000111",
    "10100101010110101",
    "01011010101001010",
    "11110000111100001",
    "00001111000011110"
  ];
  
  // Increase columns for higher density
  const columns = 150;
  
  // Memoize the column configurations to prevent recalculation on re-renders
  const columnConfigs = useMemo(() => {
    return [...Array(columns)].map((_, columnIndex) => {
      const pattern = patterns[columnIndex % patterns.length];
      const basePosition = (columnIndex / columns) * 100;
      const offset = (Math.random() - 0.5) * 2; // Random offset between -1 and 1
      const leftPosition = `${basePosition + offset}%`;
      
      // Create variation in speeds but keep them close enough for visual coherence
      const speed = 12 + Math.random() * 4; // Speed between 12-16s
      const delay = Math.random() * -8; // Smaller delay range for better distribution
      
      // Repeat the pattern 3 times to ensure seamless looping
      const repeatedPattern = pattern.repeat(3);
      
      return {
        leftPosition,
        speed,
        delay,
        pattern: repeatedPattern
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden min-h-screen">
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
                className="text-cyan-500/10 font-mono text-[10px] leading-tight"
              >
                {bit}
              </div>
            ))}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes binaryFall {
          0% {
            transform: translateY(-33.33%);
          }
          100% {
            transform: translateY(33.33%);
          }
        }
      `}</style>
    </div>
  );
};

export default BinaryBackgroundSeamless;
