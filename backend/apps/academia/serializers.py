from rest_framework import serializers
from .models import Aluno, Turma, Graduacao, DiaSemana

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = '__all__'

class TurmaSerializer(serializers.ModelSerializer):
    dias = serializers.SerializerMethodField()  # Custom field to get 'dia' values

    class Meta:
        model = Turma
        fields = ['id', 'nome', 'horario', 'dias', 'dias_da_semana']

    def get_dias(self, obj):
        return [dia.dia for dia in obj.dias_da_semana.all()]  # Retrieve 'dia' values from related DiaSemana

class GraduacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graduacao
        fields = '__all__'

class DiaSemanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaSemana
        fields = ['dia']


