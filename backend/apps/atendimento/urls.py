from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AulaViewSet

router = DefaultRouter()
router.register(r'aulas', AulaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
