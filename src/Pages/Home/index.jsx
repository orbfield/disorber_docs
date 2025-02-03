// src/modules/Home/index.jsx
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
          <p className="text-gray-300">
            Explore mathematical concepts through interactive visualizations and
            hands-on learning.
          </p>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl font-semibold mb-3 text-cyan-400">
            Featured Content
          </h2>
          <p className="text-gray-300">
            Check out our latest visualizations and interactive mathematical
            demonstrations.
          </p>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl font-semibold mb-3 text-cyan-400">
            Learning Path
          </h2>
          <p className="text-gray-300">
            Follow our structured learning path to master mathematical concepts
            step by step.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
