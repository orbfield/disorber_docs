import panel as pn
import param
from opentelemetry import trace

# Initialize tracer once
tracer = trace.get_tracer(__name__)

class ErrorService(param.Parameterized):
    # Single source of truth for errors
    error = param.Dict(default=None)
    
    def clear_error(self):
        self.error = None
        
    def set_error(self, error_type: str, message: str, span=None):
        self.error = {'type': error_type, 'message': message}
        if span:
            span.set_status(trace.Status(trace.StatusCode.ERROR))
            span.record_exception(Exception(message))

# Create singleton error service
error_service = ErrorService()

class AnalysisComponent(param.Parameterized):
    # Input parameters
    dataset = param.String(default='')
    metric = param.String(default='')
    threshold = param.Number(default=0)
    
    # Computed results
    results = param.Dict(default={})
    
    @param.depends('dataset', 'metric', 'threshold')
    def compute(self):
        with tracer.start_as_current_span("analysis") as span:
            try:
                error_service.clear_error()
                
                # Add trace context
                span.set_attribute("dataset", self.dataset)
                span.set_attribute("metric", self.metric)
                
                # Your computation logic here
                self.results = {
                    'data': compute_something(),
                    'trace_id': format(span.get_span_context().trace_id, "x")
                }
                
            except Exception as e:
                error_service.set_error('ANALYSIS_ERROR', str(e), span)
                self.results = {}

    @param.depends('results', error_service.param.error)
    def view(self):
        if error_service.error:
            return pn.pane.Alert(
                error_service.error['message'], 
                alert_type='danger'
            )
            
        return pn.Column(
            # Your visualization components here
            # They'll automatically update when results change
        )

# Usage
analysis = AnalysisComponent()
dashboard = pn.Column(
    pn.widgets.TextInput.from_param(analysis.param.dataset),
    pn.widgets.TextInput.from_param(analysis.param.metric),
    pn.widgets.NumberInput.from_param(analysis.param.threshold),
    analysis.view
)