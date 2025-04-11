from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
import pandas as pd
from django.http import HttpResponse
from django.db.models import Count, Avg, Q
from datetime import datetime

from apps.academia.models import Aluno, Turma
from .models import Aula
from apps.contas.models import Instrutor

class CustomPagination(PageNumberPagination):
    page_size = 20

class RelatoriosViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def list(self, request):
        """
        Generate reports based on filters provided in query parameters.
        """
        # Get filter parameters
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        tipo = request.query_params.get('tipo', 'presenca')
        turmas_ids = request.query_params.getlist('turmas')
        alunos_ids = request.query_params.getlist('alunos')
        instrutores_ids = request.query_params.getlist('instrutores')

        # Base query filter for aulas
        date_filter = Q()
        if data_inicio:
            date_filter &= Q(data__gte=data_inicio)
        if data_fim:
            date_filter &= Q(data__lte=data_fim)

        # Apply filters for specific models
        aulas_query = Aula.objects.filter(date_filter)
        
        if turmas_ids:
            aulas_query = aulas_query.filter(turma__id__in=turmas_ids)
        
        if instrutores_ids:
            aulas_query = aulas_query.filter(instrutores__id__in=instrutores_ids)

        # Generate report based on tipo
        if tipo == 'presenca':
            results = self._generate_presenca_report(aulas_query, alunos_ids)
        elif tipo == 'aulas':
            results = self._generate_aulas_report(aulas_query)
        elif tipo == 'instrutores':
            results = self._generate_instrutores_report(aulas_query, instrutores_ids)
        elif tipo == 'turmas':
            results = self._generate_turmas_report(aulas_query, turmas_ids)
        else:
            return Response({"error": "Tipo de relatório inválido"}, status=status.HTTP_400_BAD_REQUEST)

        # Apply pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(results, request)
        
        if page is not None:
            return paginator.get_paginated_response(page)
        
        return Response(results)
    
    def _generate_presenca_report(self, aulas_query, alunos_ids=None):
        """
        Generate report for student attendance
        """
        results = []
        
        for aula in aulas_query:
            # Get all students in the class
            alunos_turma = Aluno.objects.filter(turma=aula.turma)
            
            # If specific students are requested, filter them
            if alunos_ids:
                alunos_turma = alunos_turma.filter(id__in=alunos_ids)
            
            # For each student, check if they were present
            for aluno in alunos_turma:
                presente = aluno.id in [a.id for a in aula.alunos_presentes.all()]
                
                results.append({
                    'data': aula.data,
                    'aluno': {
                        'id': aluno.id,
                        'nome': aluno.nome
                    },
                    'turma': {
                        'id': aula.turma.id,
                        'nome': aula.turma.nome
                    },
                    'presente': presente
                })
        
        return results
    
    def _generate_aulas_report(self, aulas_query):
        """
        Generate report summarizing classes
        """
        results = []
        
        for aula in aulas_query:
            results.append({
                'data': aula.data,
                'turma': {
                    'id': aula.turma.id,
                    'nome': aula.turma.nome
                },
                'instrutores': [
                    {'id': instrutor.id, 'nome': instrutor.nome}
                    for instrutor in aula.instrutores.all()
                ],
                'total_alunos': aula.alunos_presentes.count(),
                'horario_inicio': aula.horario_inicio,
                'horario_fim': aula.horario_fim,
                'observacao': aula.observacao
            })
        
        return results
    
    def _generate_instrutores_report(self, aulas_query, instrutores_ids=None):
        """
        Generate report on instructor performance
        """
        results = []
        
        # If specific instructors are requested, use them; otherwise, get all instructors from aulas
        if instrutores_ids:
            instrutores = Instrutor.objects.filter(id__in=instrutores_ids)
        else:
            instrutor_ids = aulas_query.values_list('instrutores', flat=True).distinct()
            instrutores = Instrutor.objects.filter(id__in=instrutor_ids)
        
        for instrutor in instrutores:
            # Get all classes taught by this instructor
            aulas_instrutor = aulas_query.filter(instrutores=instrutor)
            total_aulas = aulas_instrutor.count()
            
            # Calculate average number of students per class
            total_alunos = 0
            for aula in aulas_instrutor:
                total_alunos += aula.alunos_presentes.count()
            
            media_alunos = total_alunos / total_aulas if total_aulas > 0 else 0
            
            results.append({
                'instrutor': {
                    'id': instrutor.id,
                    'nome': instrutor.nome
                },
                'total_aulas': total_aulas,
                'media_alunos': media_alunos
            })
        
        return results
    
    def _generate_turmas_report(self, aulas_query, turmas_ids=None):
        """
        Generate report on class performance
        """
        results = []
        
        # If specific classes are requested, use them; otherwise, get all classes from aulas
        if turmas_ids:
            turmas = Turma.objects.filter(id__in=turmas_ids)
        else:
            turma_ids = aulas_query.values_list('turma', flat=True).distinct()
            turmas = Turma.objects.filter(id__in=turma_ids)
        
        for turma in turmas:
            # Get all classes for this turma
            aulas_turma = aulas_query.filter(turma=turma)
            total_aulas = aulas_turma.count()
            
            # Calculate statistics
            total_alunos = 0
            for aula in aulas_turma:
                total_alunos += aula.alunos_presentes.count()
            
            media_alunos = total_alunos / total_aulas if total_aulas > 0 else 0
            
            # Count unique students who attended at least one class
            alunos_unicos = set()
            for aula in aulas_turma:
                for aluno in aula.alunos_presentes.all():
                    alunos_unicos.add(aluno.id)
            
            results.append({
                'turma': {
                    'id': turma.id,
                    'nome': turma.nome
                },
                'total_aulas': total_aulas,
                'media_alunos': media_alunos,
                'alunos_unicos': len(alunos_unicos)
            })
        
        return results

    @action(detail=False, methods=['get'], url_path='export')
    def export_report(self, request):
        """
        Export report to Excel format
        """
        # Get filter parameters (same as list method)
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        tipo = request.query_params.get('tipo', 'presenca')
        turmas_ids = request.query_params.getlist('turmas')
        alunos_ids = request.query_params.getlist('alunos')
        instrutores_ids = request.query_params.getlist('instrutores')

        # Generate report data
        date_filter = Q()
        if data_inicio:
            date_filter &= Q(data__gte=data_inicio)
        if data_fim:
            date_filter &= Q(data__lte=data_fim)

        aulas_query = Aula.objects.filter(date_filter)
        
        if turmas_ids:
            aulas_query = aulas_query.filter(turma__id__in=turmas_ids)
        
        if instrutores_ids:
            aulas_query = aulas_query.filter(instrutores__id__in=instrutores_ids)

        # Generate report based on tipo
        if tipo == 'presenca':
            results = self._generate_presenca_report(aulas_query, alunos_ids)
            filename = "relatorio_presenca.xlsx"
            headers = ['Data', 'Aluno', 'Turma', 'Presente']
        elif tipo == 'aulas':
            results = self._generate_aulas_report(aulas_query)
            filename = "relatorio_aulas.xlsx"
            headers = ['Data', 'Turma', 'Instrutores', 'Total Alunos', 'Horário Início', 'Horário Fim', 'Observação']
        elif tipo == 'instrutores':
            results = self._generate_instrutores_report(aulas_query, instrutores_ids)
            filename = "relatorio_instrutores.xlsx"
            headers = ['Instrutor', 'Total Aulas', 'Média Alunos/Aula']
        elif tipo == 'turmas':
            results = self._generate_turmas_report(aulas_query, turmas_ids)
            filename = "relatorio_turmas.xlsx"
            headers = ['Turma', 'Total Aulas', 'Média Alunos/Aula', 'Alunos Únicos']
        else:
            return Response({"error": "Tipo de relatório inválido"}, status=status.HTTP_400_BAD_REQUEST)

        # Convert results to DataFrame for easy export
        df = self._convert_to_dataframe(results, tipo)
        
        # Create response with Excel file
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        # Export DataFrame to Excel
        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Relatório')
        
        return response
    
    def _convert_to_dataframe(self, results, tipo):
        """
        Convert report results to pandas DataFrame for Excel export
        """
        if tipo == 'presenca':
            data = [
                {
                    'Data': self._format_date(item['data']),
                    'Aluno': item['aluno']['nome'],
                    'Turma': item['turma']['nome'],
                    'Presente': 'Sim' if item['presente'] else 'Não'
                }
                for item in results
            ]
        elif tipo == 'aulas':
            data = [
                {
                    'Data': self._format_date(item['data']),
                    'Turma': item['turma']['nome'],
                    'Instrutores': ', '.join([i['nome'] for i in item['instrutores']]),
                    'Total Alunos': item['total_alunos'],
                    'Horário Início': item['horario_inicio'],
                    'Horário Fim': item['horario_fim'],
                    'Observação': item['observacao'] or ''
                }
                for item in results
            ]
        elif tipo == 'instrutores':
            data = [
                {
                    'Instrutor': item['instrutor']['nome'],
                    'Total Aulas': item['total_aulas'],
                    'Média Alunos/Aula': round(item['media_alunos'], 1)
                }
                for item in results
            ]
        elif tipo == 'turmas':
            data = [
                {
                    'Turma': item['turma']['nome'],
                    'Total Aulas': item['total_aulas'],
                    'Média Alunos/Aula': round(item['media_alunos'], 1),
                    'Alunos Únicos': item['alunos_unicos']
                }
                for item in results
            ]
        else:
            return pd.DataFrame()
        
        return pd.DataFrame(data)
    
    def _format_date(self, date_str):
        """Format date strings for better display in Excel"""
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
            return date_obj.strftime('%d/%m/%Y')
        except (ValueError, TypeError):
            try:
                date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                return date_obj.strftime('%d/%m/%Y')
            except (ValueError, TypeError):
                return date_str