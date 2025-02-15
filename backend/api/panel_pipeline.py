import panel as pn
import param
import numpy as np

class TestPipeline(param.Parameterized):
    value = param.Number(default=0)
    multiplier = param.Number(default=1)
    
    def __init__(self, **params):
        super().__init__(**params)
        self.result = pn.widgets.StaticText(value='0')
        
    @param.depends('value', 'multiplier')
    def calculate(self):
        return self.value * self.multiplier
    
    def view(self):
        template = pn.template.BootstrapTemplate(
            title='Test Pipeline',
            sidebar_width=350
        )
        
        controls = pn.Column(
            pn.widgets.NumberInput.from_param(self.param.value, name='Value'),
            pn.widgets.NumberInput.from_param(self.param.multiplier, name='Multiplier'),
            self.result,
            sizing_mode='stretch_width'
        )
        
        template.sidebar.append(controls)
        return template

def panel_app(doc):
    pipeline = TestPipeline()
    app = pipeline.view()
    app.server_doc(doc)
