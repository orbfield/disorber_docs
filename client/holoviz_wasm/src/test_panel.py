"""
Basic Panel app for testing WASM conversion
"""
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

# Make the app servable
app.servable()
