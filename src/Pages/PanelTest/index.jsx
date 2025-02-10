import React, { useState, useEffect } from 'react';
import { PanelProvider, PanelWindow } from '../../components/panel';
import { WindowProvider } from '../../components/window';

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
    <svg width={width} height={height} className="bg-white dark:bg-gray-800">
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

const PanelTestContent = () => {
  const [windows, setWindows] = useState([]);
  const [nextId, setNextId] = useState(1);


  const addSineWave = () => {
    const id = `sine-wave-${nextId}`;
    setWindows(prev => [...prev, {
      id,
      title: `Sine Wave ${nextId}`,
      pythonCode: `
import panel as pn
import numpy as np
from bokeh.plotting import figure
from bokeh.models import ColumnDataSource

# Enable Panel extension
pn.extension()

# Create initial data
x = np.linspace(0, 10, 500)
y = np.sin(2 * np.pi * x)
source = ColumnDataSource(data={'x': x, 'y': y})

# Create the plot
plot = figure(width=400, height=300, title='Interactive Sine Wave')
plot.line('x', 'y', source=source, line_width=2)

# Create widgets
frequency = pn.widgets.FloatSlider(name='Frequency', value=1.0, start=0.1, end=5.0, step=0.1)
amplitude = pn.widgets.FloatSlider(name='Amplitude', value=1.0, start=0.1, end=2.0, step=0.1)
phase = pn.widgets.FloatSlider(name='Phase', value=0.0, start=0, end=2*np.pi, step=0.1)

# Update function
def update(event):
    x = np.linspace(0, 10, 500)
    y = amplitude.value * np.sin(2 * np.pi * frequency.value * x + phase.value)
    source.data = {'x': x, 'y': y}

# Link widgets to plot updates
frequency.param.watch(update, 'value')
amplitude.param.watch(update, 'value')
phase.param.watch(update, 'value')

# Create the app
app = pn.Column(
    pn.pane.Markdown('# Interactive Sine Wave Demo'),
    pn.Row(
        pn.Column(frequency, amplitude, phase),
        plot
    )
)

# Return the app
app.servable()
      `
    }]);
    setNextId(prev => prev + 1);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-x-4">
          <button
            onClick={addSineWave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Interactive Sine Wave
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        Create interactive visualizations by adding windows. Each window runs Python code in your browser using WASM.
      </div>

      {windows.map((window, index) => (
        <div key={window.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">{window.title}</h3>
          <PanelWindow
            id={window.id}
            title={window.title}
            pythonCode={window.pythonCode}
            initialPosition={{ x: 100 + index * 50, y: 100 + index * 50 }}
          />
        </div>
      ))}
    </div>
  );
};

const PanelTest = () => {
  return (
    <WindowProvider>
      <PanelProvider>
        <PanelTestContent />
      </PanelProvider>
    </WindowProvider>
  );
};

export default PanelTest;
