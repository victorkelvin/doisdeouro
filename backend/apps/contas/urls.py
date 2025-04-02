from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstrutorViewSet

router = DefaultRouter()
router.register(r'instrutores', InstrutorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
