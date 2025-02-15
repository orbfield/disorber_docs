import React, { useState, useEffect, useCallback } from 'react';
import { WindowWrapper } from '../../components/window/wrapper';
import { useWindowContext } from '../../components/window';
import { Layout } from 'lucide-react';

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

  const generatePythonCode = (amplitude, frequency, phase) => `
import numpy as np
from bokeh.plotting import figure
from bokeh.models import ColumnDataSource
import panel as pn

def update_plot(amplitude, frequency, phase):
    x = np.linspace(0, 10, 1000)
    y = amplitude * np.sin(2 * np.pi * frequency * x + phase)

    p = figure(
        width=600, 
        height=400,
        title='Interactive Sine Wave',
        tools='pan,box_zoom,wheel_zoom,reset',
        sizing_mode='stretch_both',
        background_fill_color='#1a1a1a',
        border_fill_color='#1a1a1a',
        outline_line_color='#333333'
    )

    p.grid.grid_line_color = '#333333'
    p.axis.axis_line_color = '#666666'
    p.axis.major_tick_line_color = '#666666'
    p.title.text_color = '#ffffff'
    p.xaxis.axis_label_text_color = '#999999'
    p.yaxis.axis_label_text_color = '#999999'

    source = ColumnDataSource(data=dict(x=x, y=y))
    p.line('x', 'y', source=source, line_width=2, line_color='#00a8e8')

    title = pn.pane.Markdown('# Interactive Sine Wave Demo', styles={'color': '#ffffff'})
    layout = pn.Column(
        title,
        p,
        sizing_mode='stretch_both',
        styles={'background-color': '#1a1a1a'}
    )

    return layout

result = update_plot(${amplitude}, ${frequency}, ${phase})
`;

  // Add useEffect to automatically open the window on mount
  useEffect(() => {
    console.log('PanelTest component mounted');
    handleOpenWindow();
  }, []);

  const handleOpenWindow = async () => {    
    console.log('Handling window open');
    const existingWindow = windows[windowId];
    if (existingWindow && !existingWindow.isVisible) {
      console.log('Toggling existing window visibility');
      toggleWindowVisibility(windowId);
      return;
    }
    
    if (!isWindowActive) {
      console.log('Creating new window');
      const width = 800;
      const height = 800;
      const x = Math.max(0, Math.random() * (window.innerWidth - width));
      const y = Math.max(0, Math.random() * (window.innerHeight - height));
      
      registerWindow(windowId, {
        x, y, width, height,
        onClose: () => {
          setIsWindowActive(false);
          if (worker) {
            worker.terminate();
            setWorker(null);
          }
        }
      });
      
      setIsWindowActive(true);

      try {
        console.log('Initializing Pyodide worker');
        const pyodideWorker = new Worker(new URL('../../workers/pyodide.worker.js', import.meta.url), { type: 'module' });
        
        pyodideWorker.onmessage = (event) => {
          console.log('Received message from worker:', event.data);
          const { result, error } = event.data;
          if (error) {
            console.error('Python Error:', error);
            setError(error);
          } else if (result) {
            setPlotData(result);
            setError(null);
          }
        };

        pyodideWorker.onerror = (error) => {
          console.error('Worker error:', error);
          setError('Worker failed: ' + error.message);
        };

        setWorker(pyodideWorker);
      } catch (error) {
        console.error('Failed to initialize worker:', error);
        setError('Failed to initialize Python environment: ' + error.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, [worker]);

  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId;
      return (newValues) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!worker) return;
          worker.postMessage({ 
            python: generatePythonCode(
              newValues.amplitude,
              newValues.frequency,
              newValues.phase
            ),
            id: Date.now()
          });
        }, 100);
      };
    })(),
    [worker]
  );

  // Replace the useEffect with a simpler one that calls debouncedUpdate
  useEffect(() => {
    debouncedUpdate({ frequency, amplitude, phase });
  }, [frequency, amplitude, phase, debouncedUpdate]);

  return (
    <WindowWrapper
      id={windowId}
      className="bg-gray-800/70 backdrop-blur-lg border border-cyan-500/20 flex-lg shadow-lg"
      initialPosition={{ 
        x: Math.max(0, Math.random() * (window.innerWidth - 800)),
        y: Math.max(0, Math.random() * (window.innerHeight - 800))
      }}
      defaultVisible={true}  // Make window visible by default
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
                <div 
                  dangerouslySetInnerHTML={{ __html: plotData }} 
                  className="w-full h-full"
                  style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                />
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