import React, { useState } from 'react';
import { PanelProvider, PanelWindow } from '../../components/panel';
import { WindowProvider } from '../../components/window';

const PanelTestContent = () => {
  const [windows, setWindows] = useState([]);
  const [nextId, setNextId] = useState(1);

  const addSineWave = () => {
    const id = `sine-wave-${nextId}`;
    setWindows(prev => [...prev, {
      id,
      title: `Sine Wave ${nextId}`,
      pythonCode: `
import numpy as np
import panel as pn

# Create interactive widgets
amplitude = pn.widgets.FloatSlider(name='Amplitude', value=1, start=0, end=2)
frequency = pn.widgets.FloatSlider(name='Frequency', value=1, start=0, end=5)
phase = pn.widgets.FloatSlider(name='Phase', value=0, start=0, end=2*np.pi)

# Create the plot
x = np.linspace(0, 10, 1000)

@pn.depends(amplitude, frequency, phase)
def update_plot(amp, freq, ph):
    y = amp * np.sin(freq * x + ph)
    return pn.Column(
        pn.pane.Markdown('## Interactive Sine Wave'),
        pn.pane.Bokeh(pn.plotting.figure(height=300).line(x, y))
    )

# Create the layout
layout = pn.Column(
    amplitude,
    frequency,
    phase,
    update_plot
)

layout.servable(target='${id}')
      `
    }]);
    setNextId(prev => prev + 1);
  };

  const addWaveform = () => {
    const id = `waveform-${nextId}`;
    setWindows(prev => [...prev, {
      id,
      title: `Waveform ${nextId}`,
      pythonCode: `
import numpy as np
import panel as pn
import datashader as ds
import pandas as pd

try:
    # Create interactive parameters
    points = pn.widgets.IntSlider(name='Points', value=1000, start=100, end=10000)
    frequency = pn.widgets.FloatSlider(name='Frequency', value=1, start=0.1, end=10)
    noise = pn.widgets.FloatSlider(name='Noise', value=0.1, start=0, end=1)

    @pn.depends(points, frequency, noise)
    def create_waveform(n_points, freq, noise_level):
        try:
            x = np.linspace(0, 10, n_points)
            base = np.sin(2 * np.pi * freq * x)
            noise_signal = np.random.normal(0, noise_level, n_points)
            y = base + noise_signal
            
            # Create datashader plot
            cvs = ds.Canvas(plot_width=400, plot_height=300)
            df = pd.DataFrame({'x': x, 'y': y})
            agg = cvs.line(df, 'x', 'y')
            img = ds.transfer_functions.shade(agg)
            
            return pn.Column(
                pn.pane.Markdown('## Noisy Waveform'),
                pn.pane.PNG(img)
            )
        except Exception as e:
            return pn.pane.Markdown(f'Error: {str(e)}')
except Exception as e:
    print(f'Setup error: {str(e)}')

# Create layout
layout = pn.Column(
    points,
    frequency,
    noise,
    create_waveform
)

layout.servable(target='${id}')
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
            Add Sine Wave
          </button>
          <button
            onClick={addWaveform}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add Waveform
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        Create interactive visualizations by adding windows. Each window runs Python code in your browser using WASM.
      </div>

      {windows.map((window, index) => (
        <PanelWindow
          key={window.id}
          id={window.id}
          title={window.title}
          pythonCode={window.pythonCode}
          initialPosition={{ x: 100 + index * 50, y: 100 + index * 50 }}
        />
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
