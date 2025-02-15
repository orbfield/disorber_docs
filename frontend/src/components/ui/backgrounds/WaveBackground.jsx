import React from 'react';
import { motion } from 'framer-motion';

const WaveBackground = () => {
  const generateWavePoints = () => {
    const points = [];
    const width = 800;
    const height = 100;
    const n = 4;
    
    for (let i = 0; i < width; i += 5) {
      const x = (i - width / 2) / 50;
      const r = Math.abs(x);
      const kappa = Math.PI * Math.pow(Math.sqrt(n), 3);
      const alpha = 0.0126;
      
      const gaussian = Math.exp((-alpha * (x * x)) / 2);
      const wave = Math.cos(1.5 * kappa * r);
      const quantum = gaussian * wave;
      
      const value = quantum;
      points.push([i, height / 2 + value * 30]);
    }
    
    return points;
  };

  const pointsToPath = (points) => {
    return points.reduce((path, [x, y], i) => {
      return path + `${i === 0 ? "M" : "L"} ${x} ${y} `;
    }, "");
  };

  const wavePoints = generateWavePoints();

  return (
    <div className="absolute inset-0 overflow-hidden bg-black/20 backdrop-blur-sm">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 opacity-10"
          animate={{
            y: [0, -3, 0],
            x: [-5, 5, -5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 800 100"
            preserveAspectRatio="none"
          >
            <path
              d={pointsToPath(wavePoints)}
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-cyan-500"
            />
            <path
              d={pointsToPath(wavePoints.map(([x, y]) => [x, y + 5]))}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-blue-500"
            />
            <path
              d={pointsToPath(wavePoints.map(([x, y]) => [x, y - 5]))}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-green-500"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default WaveBackground;
