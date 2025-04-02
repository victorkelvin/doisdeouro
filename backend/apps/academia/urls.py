from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlunoViewSet, GraduacaoViewSet, TurmaViewSet

router = DefaultRouter()
router.register(r'alunos', AlunoViewSet)
router.register(r'graduacoes', GraduacaoViewSet)
router.register(r'turmas', TurmaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
