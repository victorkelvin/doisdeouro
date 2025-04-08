from rest_framework import serializers
from apps.atendimento.models import Aula

class AulaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = ['id', 'data', 'alunos_presentes', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutores']
    
    def create(self, validated_data):
        aula = Aula.objects.create(**validated_data)
        return aula



class AulaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = ['id', 'data', 'alunos_presentes', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutores']
    
    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class AulaListSerializer(serializers.ModelSerializer):
    alunos_presentes = serializers.StringRelatedField()
    turma = serializers.StringRelatedField()
    instrutores = serializers.StringRelatedField()
    
    class Meta:
        model = Aula
        fields = ['id', 'data', 'alunos_presentes', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutores']
