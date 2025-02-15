from rest_framework.decorators import api_view
from rest_framework.response import Response
from bokeh.embed import server_document
from django.shortcuts import render

@api_view(['GET'])
def test_view(request):
    return Response({"message": "API is working!"})

def panel_view(request):
    script = server_document(request.build_absolute_uri())
    return render(request, "panel.html", {"script": script})
