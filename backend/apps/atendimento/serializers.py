from rest_framework import serializers
from apps.atendimento.models import Aula

class AulaCreateSerializer(serializers.ModelSerializer):
    """Serializer para criar aulas"""
    class Meta:
        model = Aula
        fields = ['id', 'data', 'aluno_presente', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutor']
    
    def create(self, validated_data):
        """
        Create and return a new Aula instance, given the validated data.
        """
        aula = Aula.objects.create(**validated_data)
        return aula

class AulaUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualizar aulas"""
    class Meta:
        model = Aula
        fields = ['id', 'data', 'aluno_presente', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutor']
    
    def update(self, instance, validated_data):
        """
        Update and return an existing Aula instance, given the validated data.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class AulaListSerializer(serializers.ModelSerializer):
    """Serializer para listar aulas"""
    aluno_presente = serializers.StringRelatedField()
    turma = serializers.StringRelatedField()
    instrutor = serializers.StringRelatedField(many=True)
    
    class Meta:
        model = Aula
        fields = ['id', 'data', 'aluno_presente', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutor']
