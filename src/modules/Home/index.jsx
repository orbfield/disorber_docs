import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
        Welcome to disorber
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl font-semibold mb-3 text-cyan-400">
            Get Started
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <p className="text-gray-300">Click and drag to move the canvas</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-300">Use mouse wheel to zoom in/out</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl font-semibold mb-3 text-cyan-400">
            Tree Node Example
          </h2>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <div className="flex-1 p-2 bg-gray-700 rounded-lg text-gray-300">Root Node</div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="flex-1 p-2 bg-gray-700/50 rounded-lg text-gray-300">Child Node 1</div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="flex-1 p-2 bg-gray-700/50 rounded-lg text-gray-300">Child Node 2</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl font-semibold mb-3 text-cyan-400">
            Quick Tips
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Double click nodes to expand</li>
            <li>Use arrow keys to navigate</li>
            <li>Press Esc to reset view</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
