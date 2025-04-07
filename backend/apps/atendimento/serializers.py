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
        validated_data contains all the serializer fields that passed validation.
        We pop the 'instrutor' field separately because it's a ManyToMany relationship.
        The remaining validated_data is used to create the Aula instance.
        """
        instrutores = validated_data.pop('instrutor', [])  # Get and remove instructors from data
        aula = Aula.objects.create(**validated_data)  # Create aula with remaining fields
        aula.instrutor.set(instrutores)  # Set the many-to-many relationship
        return aula

class AulaUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualizar aulas"""
    class Meta:
        model = Aula
        fields = ['id', 'data', 'aluno_presente', 'horario_inicio', 'horario_fim', 
                 'observacao', 'turma', 'instrutor']
    
    def update(self, instance, validated_data):
        """
        validated_data contains the new values that passed validation.
        We handle the ManyToMany 'instrutor' field separately.
        Other fields are updated directly on the instance.
        """
        instrutores = validated_data.pop('instrutor', None)  # Get and remove instructors
        
        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update instructors if provided
        if instrutores is not None:
            instance.instrutor.set(instrutores)
        
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
