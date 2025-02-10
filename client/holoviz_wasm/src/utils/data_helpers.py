"""
Utility functions for data processing and visualization.
"""
import numpy as np
import holoviews as hv
import datashader as ds

def create_curve_data(x_range=(0, 10), samples=1000):
    """Create x coordinates for curve plotting."""
    return np.linspace(x_range[0], x_range[1], samples)

def apply_datashader(curve, width=800, height=400):
    """Apply datashader to a HoloViews curve if available."""
    try:
        # Attempt to use datashader for better performance
        return ds.datashade(curve, width=width, height=height)
    except Exception:
        # Fallback to regular rendering if datashader is not available
        return curve.opts(width=width, height=height)

def create_dynamic_map(callback, streams, backend='bokeh'):
    """Create a HoloViews DynamicMap that works in both environments."""
    dmap = hv.DynamicMap(callback, streams=streams)
    return dmap.opts(backend=backend)
