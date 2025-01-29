import React from 'react';
import { motion } from 'framer-motion';

const BinaryBackgroundOriginal = ({ isCollapsed }) => {
  const patterns = [
    "0110100110010110",
    "1001011001101001",
    "1100001100111100",
    "0011110011000011",
    "1010010101011010",
    "0101101010100101"
  ];
  const columns = 94;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden min-h-screen">
      <div className="relative w-full h-full">
        {[...Array(columns)].map((_, columnIndex) => {
          const pattern = patterns[columnIndex % patterns.length];
          const basePosition = (columnIndex / columns) * 100;
          const offset = columnIndex % 2 === 0 ? 1 : -1;
          const leftPosition = `${basePosition + offset}%`;

          return (
            <motion.div
              key={columnIndex}
              className="absolute flex flex-col items-center"
              style={{ left: leftPosition }}
              initial={{ y: "-100vh" }}
              animate={{ y: "100vh" }}
              transition={{
                duration: 15 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear",
                delay: (columnIndex % 4) * 2,
              }}
            >
              {pattern.split("").map((bit, bitIndex) => (
                <div
                  key={bitIndex}
                  className="text-cyan-500/10 font-mono text-xs mb-0"
                >
                  {bit}
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BinaryBackgroundOriginal;
