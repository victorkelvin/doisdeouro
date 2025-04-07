from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Instrutor
from .serializers import InstrutorCreateSerializer, InstrutorUpdateSerializer, InstrutorListSerializer
from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size = 10

class InstrutorViewSet(viewsets.ModelViewSet):
    queryset = Instrutor.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InstrutorCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return InstrutorUpdateSerializer
        return InstrutorListSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)