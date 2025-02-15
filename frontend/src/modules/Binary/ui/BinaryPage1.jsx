import React from 'react';
import { motion } from 'framer-motion';
import { BinaryProvider, useBinary } from '../core/BinaryContext';
import { Workspace } from './Workspace';
import { Trace } from './Trace';
import { Display } from './Display';
import { WindowProvider } from '../../../components/window/index';

const BinaryContent = () => {
  const {
    streams,
    isRunning,
    speed,
    blurAmount,
    blurSliderValue,
    colorSliderValue,
    zeroColor,
    isTouchDevice,
    orientation,
    lineLength,
    maxStreams,
    adjustSpeed,
    adjustBlur,
    adjustColor,
    handleAddRandomStream,
    clearStreams,
    toggleRunning,
    addStream,
    adjustLineLength,
    adjustMaxStreams
  } = useBinary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 overflow-hidden"
    >
      <div className="absolute inset-0">
        <h1 className="text-3xl font-bold py-4 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent text-center">
          Binary
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pt-16"
        >
          <WindowProvider>
            <Workspace 
              isRunning={isRunning}
              speed={speed}
              adjustSpeed={adjustSpeed}
              toggleRunning={toggleRunning}
              lineLength={lineLength}
              adjustLineLength={adjustLineLength}
              maxStreams={maxStreams}
              adjustMaxStreams={adjustMaxStreams}
            />
            <Trace 
              streams={streams}
              maxStreams={maxStreams}
              handleAddRandomStream={handleAddRandomStream}
              clearStreams={clearStreams}
              blurAmount={blurAmount}
              blurSliderValue={blurSliderValue}
              adjustBlur={adjustBlur}
              colorSliderValue={colorSliderValue}
              adjustColor={adjustColor}
              zeroColor={zeroColor}
              isTouchDevice={isTouchDevice}
              orientation={orientation}
              addStream={addStream}
            />
            <Display 
              streams={streams}
              lineLength={lineLength}
              blurAmount={blurAmount}
              zeroColor={zeroColor}
            />
          </WindowProvider>
        </motion.div>
      </div>
    </motion.div>
  );
};

const BinaryPage = () => {
  return (
    <BinaryProvider>
      <BinaryContent />
    </BinaryProvider>
  );
};

export default BinaryPage;
