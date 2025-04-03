from rest_framework import serializers
from .models import Instrutor

class InstrutorCreateSerializer(serializers.ModelSerializer):
    """Serializer para criar instrutores (com senha)"""
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Instrutor
        fields = ['id', 'email', 'username', 'nome', 'password', 'graduacao', 'contato', 'foto', 'is_active']
    
    def create(self, validated_data):
        # Cria o usuário usando o manager que já criptografa a senha
        instrutor = Instrutor.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            nome=validated_data.get('nome', ''),
            graduacao=validated_data.get('graduacao', None),
            contato=validated_data.get('contato', ''),
            foto=validated_data.get('foto', None),
            is_active=validated_data.get('is_active', True)
        )
        return instrutor

class InstrutorUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualizar instrutores (sem senha obrigatória)"""
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Instrutor
        fields = ['id', 'email', 'username', 'nome', 'password', 'graduacao', 'contato', 'foto', 'is_active']
        extra_kwargs = {
            'password': {'required': False}
        }
    
    def update(self, instance, validated_data):
        # Se a senha foi fornecida, criptografa e salva
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        # Atualiza os outros campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class InstrutorListSerializer(serializers.ModelSerializer):
    """Serializer para listar instrutores (sem senha)"""
    graduacao_nome = serializers.CharField(source='graduacao.faixa', read_only=True)
    
    class Meta:
        model = Instrutor
        fields = ['id', 'email', 'username', 'nome', 'graduacao', 'graduacao_faixa', 'contato', 'foto', 'is_active']