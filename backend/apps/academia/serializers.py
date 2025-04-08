from rest_framework import serializers
from .models import Aluno, Turma, Graduacao, DiaSemana

class AlunoSerializer(serializers.ModelSerializer):
    faixa = serializers.StringRelatedField(source='graduacao.faixa', read_only=True)
    turma_nome = serializers.StringRelatedField(source='turma.nome', read_only=True)
    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'data_nascimento', 'contato', 'foto', 'graduacao', 'faixa', 'turma', 'turma_nome']


class TurmaSerializer(serializers.ModelSerializer):
    dias = serializers.SerializerMethodField()  

    class Meta:
        model = Turma
        fields = ['id', 'nome', 'horario', 'dias', 'dias_da_semana']

    def get_dias(self, obj):
        return [dia.dia for dia in obj.dias_da_semana.all()]



class GraduacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graduacao
        fields = '__all__'

class DiaSemanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaSemana
        fields = ['dia']


