cd client/holoviz_wasm && conda activate holoviz_wasm && panel serve src/test_panel.py --autoreload


# Reactive Analysis Component Documentation

## Overview
This document describes a reactive analysis component built with Panel, Param, and OpenTelemetry. The component provides real-time data analysis with integrated error handling and performance monitoring.

## Core Components

### Error Service
The `ErrorService` class provides centralized error handling across the application.

```python
class ErrorService(param.Parameterized):
    error = param.Dict(default=None)
```

Key features:
- Maintains a single source of truth for error states
- Integrates with OpenTelemetry for error tracking
- Provides reactive error updates to UI components

Methods:
- `clear_error()`: Resets error state
- `set_error(error_type, message, span)`: Sets error state and updates telemetry

### Analysis Component
The `AnalysisComponent` class handles data processing and visualization.

```python
class AnalysisComponent(param.Parameterized):
    dataset = param.String(default='')
    metric = param.String(default='')
    threshold = param.Number(default=0)
    results = param.Dict(default={})
```

#### Input Parameters
- `dataset`: String identifier for the data source
- `metric`: Analysis metric selection
- `threshold`: Numerical threshold for analysis
- `results`: Dictionary containing computed results

#### Reactive Methods

1. `compute()`
   - Triggered by changes to input parameters
   - Executes analysis with telemetry tracking
   - Updates results state
   - Handles errors through ErrorService

2. `view()`
   - Reacts to changes in results and error states
   - Renders appropriate UI components
   - Automatically updates when dependencies change

## Telemetry Integration

The application uses OpenTelemetry for performance monitoring:

```python
tracer = trace.get_tracer(__name__)
```

Span tracking:
- Analysis operations wrapped in spans
- Error states recorded in span context
- Key metrics tracked as span attributes

## Usage Example

```python
# Create component instance
analysis = AnalysisComponent()

# Create dashboard
dashboard = pn.Column(
    pn.widgets.TextInput.from_param(analysis.param.dataset),
    pn.widgets.TextInput.from_param(analysis.param.metric),
    pn.widgets.NumberInput.from_param(analysis.param.threshold),
    analysis.view
)
```

## Best Practices

1. Error Handling
   - Always use ErrorService for error management
   - Include relevant context in error messages
   - Clear errors before new computations

2. Telemetry
   - Add span attributes for important parameters
   - Record exceptions in span context
   - Use meaningful span names

3. Reactivity
   - Use param.depends for automatic updates
   - Keep compute and view logic separate
   - Minimize side effects in reactive methods

## Dependencies
- opentelemetry-api
- panel
- param

## Performance Considerations
- Heavy computations should be performed in `compute()`
- View method should focus on rendering
- Error handling should not block UI updates

## Extending the Component

To add new features:

1. Add new parameters to AnalysisComponent
2. Extend compute method with new logic
3. Update view method for new visualizations
4. Add appropriate error handling
5. Include relevant telemetry spans

Example:

```python
class ExtendedAnalysisComponent(AnalysisComponent):
    new_param = param.Parameter()
    
    @param.depends('new_param', 'results')
    def additional_view(self):
        # Additional visualization logic
        pass
```

## Troubleshooting

Common issues and solutions:

1. Unresponsive UI
   - Check for long-running computations in view method
   - Verify error handling is not blocking

2. Missing Telemetry Data
   - Ensure spans are properly closed
   - Verify error recording in spans

3. Delayed Updates
   - Review param dependencies
   - Check for circular dependencies

## Testing

Key areas to test:

1. Parameter Changes
   - Verify reactive updates
   - Check error states

2. Error Handling
   - Test error propagation
   - Verify UI updates

3. Telemetry
   - Validate span creation
   - Check attribute recording

Example test:
```python
def test_error_handling():
    analysis = AnalysisComponent()
    analysis.dataset = "invalid_data"
    assert error_service.error is not None
    assert "error" in error_service.error['type']
```