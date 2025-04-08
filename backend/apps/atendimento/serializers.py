from rest_framework import serializers
from apps.atendimento.models import Aula

class AulaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = ['id', 'data', 'aluno_presente', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutor']
    
    def create(self, validated_data):
        aula = Aula.objects.create(**validated_data)
        return aula

class AulaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = ['id', 'data', 'aluno_presente', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutor']
    
    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class AulaListSerializer(serializers.ModelSerializer):
    aluno_presente = serializers.StringRelatedField()
    turma = serializers.StringRelatedField()
    instrutor = serializers.StringRelatedField()
    
    class Meta:
        model = Aula
        fields = ['id', 'data', 'aluno_presente', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutor']
