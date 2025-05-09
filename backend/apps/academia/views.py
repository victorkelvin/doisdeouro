from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from .models import Aluno, Turma, Graduacao, DiaSemana
from .serializers import AlunoSerializer, GraduacaoSerializer, TurmaSerializer, DiaSemanaSerializer

class CustomPagination(PageNumberPagination):
    page_size = 200


class AlunoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer


class GraduacaoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Graduacao.objects.all().order_by('id')
    serializer_class = GraduacaoSerializer

class TurmaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Turma.objects.all().order_by('nome')
    serializer_class = TurmaSerializer

class DiaSemanaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = DiaSemana.objects.all()
    serializer_class = DiaSemanaSerializer

