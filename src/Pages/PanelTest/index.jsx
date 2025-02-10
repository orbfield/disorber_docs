import React, { useState, useEffect } from 'react';

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

# Create data
x = np.linspace(0, 10, 1000)
y = ${amplitude} * np.sin(2 * np.pi * ${frequency} * x + ${phase})

# First convert numpy arrays to Python lists
x_list = x.tolist()
y_list = y.tolist()

# Then create a plain Python dictionary
result = {
    'x': x_list,
    'y': y_list
}

# Return the dictionary
result
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
    <div className="p-4 space-y-4" style={{ height: '800px' }}>
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 h-full shadow-lg">
        <h3 className="text-xl font-semibold mb-6">Interactive Sine Wave</h3>
        
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
  );
};

export default PanelTest;
