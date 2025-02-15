import React, { createContext, useState, useCallback, useRef, useContext, useMemo, useEffect } from 'react';
import { BinaryStream } from './BinaryStream';
import { StreamManager } from './streamManager';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { logScale } from '../utils/scales';
import { calculateZeroColor } from '../utils/colors';

const BinaryContext = createContext();

export const useBinary = () => {
  const context = useContext(BinaryContext);
  if (!context) {
    throw new Error('useBinary must be used within a BinaryProvider');
  }
  return context;
};

export const BinaryProvider = ({ children }) => {
  const [streams, setStreams] = useState([]);
  const [isRunning, setIsRunning] = useState(true); // Always running with CSS animations
  const [speed, setSpeed] = useState(50);
  const [blurSliderValue, setBlurSliderValue] = useState(0);
  const [colorSliderValue, setColorSliderValue] = useState(0);
  
  const streamManager = useMemo(() => new StreamManager(BinaryStream), []);
  const [lineLength, setLineLength] = useState(streamManager.getLineLength());
  const [maxStreams, setMaxStreams] = useState(streamManager.getMaxStreams());
  const { isTouchDevice, orientation } = useDeviceDetection();

  // Derived values
  const blurAmount = useMemo(() => {
    return Number(logScale(blurSliderValue).toFixed(2));
  }, [blurSliderValue]);

  const zeroColor = useMemo(() => {
    return calculateZeroColor(colorSliderValue);
  }, [colorSliderValue]);

  // Stream management handlers
  const addStream = useCallback((key) => {
    if (key >= 1 && key <= 20) {
      setStreams(prev => streamManager.addStream(prev, key, speed));
    }
  }, [streamManager, speed]);

  const handleAddRandomStream = useCallback(() => {
    const randomKey = Math.floor(Math.random() * 20) + 1;
    addStream(randomKey);
  }, [addStream]);

  // Control handlers
  const adjustSpeed = useCallback((delta) => {
    setSpeed(prev => {
      const newSpeed = Math.max(10, Math.min(200, prev + delta));
      setStreams(streams => streamManager.updateStreamsSpeeds(streams, newSpeed));
      return newSpeed;
    });
  }, [streamManager]);

  const adjustBlur = useCallback((value) => {
    setBlurSliderValue(Math.max(0, Math.min(100, value)));
  }, []);

  const adjustColor = useCallback((value) => {
    setColorSliderValue(Math.max(0, Math.min(100, value)));
  }, []);

  const clearStreams = useCallback(() => {
    setStreams([]);
  }, []);

  const toggleRunning = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const adjustLineLength = useCallback((delta) => {
    setLineLength(prev => {
      const newLength = Math.max(40, Math.min(400, prev + delta));
      streamManager.setLineLength(newLength);
      return newLength;
    });
  }, [streamManager]);

  const adjustMaxStreams = useCallback((delta) => {
    setMaxStreams(prev => {
      const newMax = Math.max(1, Math.min(100, prev + delta));
      streamManager.setMaxStreams(newMax);
      return newMax;
    });
  }, [streamManager]);

  const value = useMemo(() => ({
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
    addStream,
    handleAddRandomStream,
    adjustSpeed,
    adjustBlur,
    adjustColor,
    clearStreams,
    toggleRunning,
    adjustLineLength,
    adjustMaxStreams
  }), [
    streams,
    isRunning,
    speed,
    blurAmount,
    blurSliderValue,
    colorSliderValue,
    zeroColor,
    isTouchDevice,
    orientation,
    addStream,
    handleAddRandomStream,
    adjustSpeed,
    adjustBlur,
    adjustColor,
    clearStreams,
    toggleRunning,
    adjustLineLength,
    adjustMaxStreams
  ]);

  return (
    <BinaryContext.Provider value={value}>
      {children}
    </BinaryContext.Provider>
  );
};
