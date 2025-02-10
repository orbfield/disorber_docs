import React, { useState, useEffect } from 'react';
import { WindowWrapper } from '../../components/window/wrapper';
import { useWindowContext } from '../../components/window';
import { Layout } from 'lucide-react';

const PlotSVG = ({ data, width = 400, height = 300 }) => {
  if (!data || !data.x || !data.y) return null;

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scale the data to fit the SVG
  const xScale = (x) => (x - Math.min(...data.x)) / (Math.max(...data.x) - Math.min(...data.x)) * innerWidth;
  const yScale = (y) => innerHeight - ((y - Math.min(...data.y)) / (Math.max(...data.y) - Math.min(...data.y)) * innerHeight);

  // Create the path
  const pathData = data.x.map((x, i) => {
    return `${i === 0 ? 'M' : 'L'} ${xScale(x) + margin.left} ${yScale(data.y[i]) + margin.top}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="bg-white dark:bg-gray-800 rounded-lg">
      {/* Add axes */}
      <line 
        x1={margin.left} 
        y1={height - margin.bottom} 
        x2={width - margin.right} 
        y2={height - margin.bottom} 
        stroke="currentColor" 
        className="text-gray-400"
      />
      <line 
        x1={margin.left} 
        y1={margin.top} 
        x2={margin.left} 
        y2={height - margin.bottom} 
        stroke="currentColor" 
        className="text-gray-400"
      />
      {/* Add the sine wave */}
      <path
        d={pathData}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-blue-500 dark:text-blue-400"
      />
    </svg>
  );
};

const PanelTest = () => {
  const [frequency, setFrequency] = useState(1.0);
  const [amplitude, setAmplitude] = useState(1.0);
  const [phase, setPhase] = useState(0.0);
  const [plotData, setPlotData] = useState(null);
  const [error, setError] = useState(null);
  const [worker, setWorker] = useState(null);
  const [isWindowActive, setIsWindowActive] = useState(false);
  const { toggleWindowVisibility, windows, registerWindow } = useWindowContext();
  const windowId = "panel-test";

  // Handle window management
  const handleOpenWindow = () => {
    const existingWindow = windows[windowId];
    if (existingWindow && !existingWindow.isVisible) {
      // If window exists but is hidden, just toggle visibility
      toggleWindowVisibility(windowId);
      return;
    }
    
    if (!isWindowActive) {
      const width = 800;
      const height = 800;
      // Position in viewport coordinates
      const x = Math.max(0, Math.random() * (window.innerWidth - width));
      const y = Math.max(0, Math.random() * (window.innerHeight - height));
      
      registerWindow(windowId, {
        x, y, width, height,
        onClose: () => setIsWindowActive(false)
      });
      
      setIsWindowActive(true);
    }
  };

  // Open window on mount
  useEffect(() => {
    handleOpenWindow();
  }, []);

  // Initialize worker
  useEffect(() => {
    const pyodideWorker = new Worker(new URL('../../workers/pyodide.worker.js', import.meta.url));
    
    pyodideWorker.onmessage = (event) => {
      const { result, error } = event.data;
      if (error) {
        console.error('Python Error:', error);
        setError(error);
      } else if (result) {
        setPlotData(result);
        setError(null);
      }
    };

    setWorker(pyodideWorker);

    return () => {
      pyodideWorker.terminate();
    };
  }, []);

  // Function to update plot data
  const updatePlot = async () => {
    if (!worker) return;

    const python = `
import numpy as np

from pyodide.ffi import to_js

# Create data
x = np.linspace(0, 10, 1000)
y = ${amplitude} * np.sin(2 * np.pi * ${frequency} * x + ${phase})

# Manually construct a plain JavaScript object that can be cloned
import json
data = {
    'x': x.tolist(),
    'y': y.tolist()
}
json.dumps(data)
    `;

    worker.postMessage({ python, id: Date.now() });
  };

  // Update plot when controls change and worker is ready
  useEffect(() => {
    if (worker) {
      updatePlot();
    }
  }, [frequency, amplitude, phase, worker]);

  return (
    <WindowWrapper
      id={windowId}
      className="bg-gray-800/70 backdrop-blur-lg border border-cyan-500/20 flex-lg shadow-lg"
    >
      <div 
        data-window-header
        className="flex items-center py-1 px-2 border-b border-gray-700 bg-gray-900 flex-t-lg"
      >
        <div className="flex items-center gap-2 px-2">
          <Layout className="w-4 h-4 text-cyan-500" />
          <h2 className="text-white font-semibold text-sm truncate max-w-[280px]">Interactive Sine Wave</h2>
        </div>
      </div>
      <div className="h-full bg-black/10">
        <div className="p-4 space-y-4">
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium mb-2">Frequency</label>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm mt-1 block">{frequency.toFixed(1)} Hz</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amplitude</label>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={amplitude}
                onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm mt-1 block">{amplitude.toFixed(1)}</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phase</label>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.1"
                value={phase}
                onChange={(e) => setPhase(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm mt-1 block">{(phase / Math.PI).toFixed(2)}π rad</span>
            </div>
          </div>

          <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner" style={{ minHeight: '500px' }}>
            {plotData ? (
              <PlotSVG data={plotData} width={600} height={400} />
            ) : (
              <div className="text-gray-500">
                {worker ? 'Generating plot...' : 'Initializing Python...'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </WindowWrapper>
  );
};

export default PanelTest;
