from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import ContactAPIView

urlpatterns = [
    path('', csrf_exempt(ContactAPIView.as_view()), name='contact'),
]
