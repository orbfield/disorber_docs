"""
Interactive sine wave visualization component.
Works in both Panel server and Pyodide environments.
"""
import param
import panel as pn
import holoviews as hv
import numpy as np
from ..utils.data_helpers import create_curve_data, apply_datashader, create_dynamic_map

class SineWaveViz(param.Parameterized):
    """Interactive sine wave visualization component."""
    
    frequency = param.Number(1.0, bounds=(0.1, 5.0), step=0.1, doc="Wave frequency")
    amplitude = param.Number(1.0, bounds=(0.1, 2.0), step=0.1, doc="Wave amplitude")
    phase = param.Number(0.0, bounds=(0, 2*np.pi), step=0.1, doc="Phase shift")
    
    def __init__(self, **params):
        super().__init__(**params)
        # Initialize HoloViews extension with both backends
        hv.extension('bokeh')
        # Create the plot
        self.plot = self._create_plot()
    
    def _get_curve(self):
        """Generate the sine wave curve."""
        x = create_curve_data()
        y = self.amplitude * np.sin(2 * np.pi * self.frequency * x + self.phase)
        curve = hv.Curve((x, y))
        # Apply datashader in production, regular rendering in development
        return apply_datashader(curve)
    
    def _create_plot(self):
        """Create the interactive plot."""
        # Create streams for parameter changes
        streams = [
            param.ParamMethod(self.param, ['frequency', 'amplitude', 'phase'])
        ]
        # Create dynamic map that updates with parameter changes
        dmap = create_dynamic_map(self._get_curve, streams)
        return dmap
    
    def panel(self):
        """Return Panel layout that works in both environments."""
        return pn.Column(
            pn.pane.Markdown('## Interactive Sine Wave'),
            pn.Row(
                # Parameters on the left
                pn.Column(
                    pn.Param(
                        self.param,
                        parameters=['frequency', 'amplitude', 'phase'],
                        widgets={
                            'frequency': pn.widgets.FloatSlider,
                            'amplitude': pn.widgets.FloatSlider,
                            'phase': pn.widgets.FloatSlider
                        }
                    )
                ),
                # Plot on the right
                self.plot.panel()
            )
        )

# For development testing
if __name__ == '__main__':
    viz = SineWaveViz()
    viz.panel().servable()
