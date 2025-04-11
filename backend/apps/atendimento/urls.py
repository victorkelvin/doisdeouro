from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AulaViewSet
from .relatorios_views import RelatoriosViewSet

router = DefaultRouter()
router.register(r'aulas', AulaViewSet)
router.register(r'relatorios', RelatoriosViewSet, basename='relatorios')

urlpatterns = [
    path('', include(router.urls)),
]
