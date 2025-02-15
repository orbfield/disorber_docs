from django.urls import path
from bokeh.server.django import autoload, static_extensions
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views
from . import panel_pipeline

urlpatterns = [
    path('test/', views.test_view, name='test'),
    path('panel/', views.panel_view, name='panel'),
]

bokeh_apps = [
    autoload("panel-test", panel_pipeline.panel_app)
]

urlpatterns += static_extensions()
urlpatterns += staticfiles_urlpatterns()
