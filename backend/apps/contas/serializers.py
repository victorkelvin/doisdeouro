from rest_framework import serializers
from .models import Instrutor
import os
import base64

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
        import os
        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)

        # Handle foto update: delete old foto file if new foto is provided
        if "foto" in validated_data:
            old_foto = instance.foto
            new_foto = validated_data.get("foto")

            if old_foto and old_foto != new_foto:
                old_foto_path = old_foto.path
                if os.path.exists(old_foto_path):
                    try:
                        os.remove(old_foto_path)
                    except Exception as e:
                        print(f"Erro ao deletar foto antiga: {e}")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class InstrutorListSerializer(serializers.ModelSerializer):

    faixa = serializers.StringRelatedField(source="graduacao.faixa", read_only=True)
    foto_base64 = serializers.SerializerMethodField()

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
            "faixa",
            "is_superuser",
            "foto_base64",
        ]

    def get_foto_base64(self, obj):
        """
        Retorna a imagem em formato base64 para ser utilizada diretamente no frontend
        """
        if not obj.foto:
            return None
            
        try:
            # Pega o caminho absoluto do arquivo
            img_path = obj.foto.path
            
            # Verifica se o arquivo existe
            if not os.path.exists(img_path):
                return None
                
            # Lê o arquivo e converte para base64
            with open(img_path, "rb") as img_file:
                encoded_string = base64.b64encode(img_file.read()).decode('utf-8')
                
            # Determina o tipo de imagem
            ext = os.path.splitext(img_path)[1].lower()
            if ext == '.jpg' or ext == '.jpeg':
                mime = 'image/jpeg'
            elif ext == '.png':
                mime = 'image/png'
            else:
                mime = 'image/jpeg'  # Default
                
            # Retorna o data URL completo
            return f"data:{mime};base64,{encoded_string}"
        except Exception as e:
            print(f"Erro ao converter imagem para base64: {e}")
            return None
