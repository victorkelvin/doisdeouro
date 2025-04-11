from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.pagination import PageNumberPagination

from .models import Aula
from .serializers import AulaCreateSerializer, AulaUpdateSerializer, AulaListSerializer

#imports to generate xls
import pandas as pd
from django.http import HttpResponse
from rest_framework.decorators import action
import io
from datetime import datetime

class CustomPagination(PageNumberPagination):
    page_size = 20


class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get_serializer_class(self):
        if self.action == "create":
            return AulaCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return AulaUpdateSerializer
        return AulaListSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='export-xls')
    def export_xls(self, request):
        try:
            # Get data from the request
            data = request.data
            data_aula = data.get('data')
            horario_inicio = data.get('horario_inicio')
            horario_fim = data.get('horario_fim')
            turma_id = data.get('turma')
            instrutores_ids = data.get('instrutores', [])
            alunos_ids = data.get('alunos_presentes', [])

            # Fetch related objects
            from django.apps import apps
            Turma = apps.get_model('academia', 'Turma') 
            Instrutor = apps.get_model('contas', 'Instrutor')
            Aluno = apps.get_model('academia', 'Aluno')


            turma = Turma.objects.get(id=turma_id) if turma_id else None
            instrutores = Instrutor.objects.filter(id__in=instrutores_ids)
            alunos = Aluno.objects.filter(id__in=alunos_ids)

            # Format the date for display
            date_obj = datetime.strptime(data_aula.split('T')[0], '%Y-%m-%d')
            formatted_date = date_obj.strftime('%d/%m/%Y')

            # Create data for Excel
            excel_data = []

            # Add header information
            excel_data.append(['Relatório de Aula'])
            excel_data.append(['Data', formatted_date])
            excel_data.append(['Horário', f'{horario_inicio} - {horario_fim}'])
            excel_data.append(['Turma', turma.nome if turma else 'N/A'])

            excel_data.append([])  # Empty row as separator

            # Add instructors
            excel_data.append(['Instrutores'])
            for instrutor in instrutores:
                excel_data.append([instrutor.nome])

            excel_data.append([])  # Empty row as separator

            # Add students section
            excel_data.append(['Alunos Presentes'])
            excel_data.append(['Nome', 'Faixa'])

            for aluno in alunos:
                excel_data.append([aluno.nome, aluno.graduacao.faixa])

            # Create DataFrame
            df = pd.DataFrame(excel_data)

            # Create a response with the Excel file
            output = io.BytesIO()

            # Create Excel writer
            writer = pd.ExcelWriter(output, engine='xlsxwriter')
            df.to_excel(writer, sheet_name='Relatório de Aula', header=False, index=False)

            # Auto-adjust columns' width
            worksheet = writer.sheets['Relatório de Aula']
            for i, col in enumerate(df.columns):
                column_width = max(df[col].astype(str).map(len).max(), 10)
                worksheet.set_column(i, i, column_width)

            writer.close()

            # Prepare response
            output.seek(0)

            # Format date for filename
            filename_date = date_obj.strftime('%d-%m-%Y')
            filename = f'relatoriodeaula-{filename_date}.xls'

            response = HttpResponse(
                output.read(),
                content_type='application/vnd.ms-excel'
            )
            response['Content-Disposition'] = f'attachment; filename="{filename}"'

            return response

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )