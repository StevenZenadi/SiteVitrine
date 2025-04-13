from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/contact/', include('contact.urls')),  # ton endpoint contact existant
    path('api/comments/', include('comments.urls')),  # nouvel endpoint pour les commentaires
]
