from rest_framework import serializers
from .models import Instrutor


class InstrutorCreateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Instrutor
        fields = [
            "id",
            "email",
            "username",
            "nome",
            "password",
            "graduacao",
            "contato",
            "foto",
            "is_active",
        ]

    def create(self, validated_data):
        instrutor = Instrutor.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            nome=validated_data.get("nome", ""),
            graduacao=validated_data.get("graduacao", None),
            contato=validated_data.get("contato", ""),
            foto=validated_data.get("foto", None),
            is_active=validated_data.get("is_active", True),
        )
        return instrutor


class InstrutorUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualizar instrutores (sem senha obrigatória)"""

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Instrutor
        fields = [
            "id",
            "email",
            "username",
            "nome",
            "password",
            "graduacao",
            "contato",
            "foto",
            "is_active",
        ]
        extra_kwargs = {
            "password": {"required": False},
            "is_active": {"required": False},
        }

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class InstrutorListSerializer(serializers.ModelSerializer):

    faixa = serializers.StringRelatedField(source="graduacao.faixa", read_only=True)

    class Meta:
        model = Instrutor
        fields = [
            "id",
            "email",
            "username",
            "nome",
            "graduacao",
            "contato",
            "foto",
            "is_active",
            "faixa"
        ]


