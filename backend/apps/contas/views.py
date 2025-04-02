from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size = 10

from .models import Instrutor
from .serializers import InstrutorSerializer

class InstrutorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    queryset = Instrutor.objects.all()
    serializer_class = InstrutorSerializer
    