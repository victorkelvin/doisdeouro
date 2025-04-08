from rest_framework import serializers
from apps.atendimento.models import Aula


class AulaCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Aula
        fields = [
            "id",
            "data",
            "alunos_presentes",
            "horario_inicio",
            "horario_fim",
            "observacao",
            "turma",
            "instrutores",
        ]

    def create(self, validated_data):

        alunos_presentes = validated_data.pop("alunos_presentes", [])
        instrutores = validated_data.pop("instrutores", [])

        aula = Aula.objects.create(**validated_data)

        aula.alunos_presentes.set(alunos_presentes)
        aula.instrutores.set(instrutores)
        return aula


class AulaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = [
            "id",
            "data",
            "alunos_presentes",
            "horario_inicio",
            "horario_fim",
            "observacao",
            "turma",
            "instrutores",
        ]

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            if attr not in ["alunos_presentes", "instrutores"]:
                setattr(instance, attr, value)

        instance.save()
        if "alunos_presentes" in validated_data:
            instance.alunos_presentes.set(validated_data["alunos_presentes"])

        if "instrutores" in validated_data:
            instance.instrutores.set(validated_data["instrutores"])
        return instance


class AulaListSerializer(serializers.ModelSerializer):
    alunos_presentes = serializers.StringRelatedField()
    turma = serializers.StringRelatedField()
    instrutores = serializers.StringRelatedField()

    class Meta:
        model = Aula
        fields = [
            "id",
            "data",
            "alunos_presentes",
            "horario_inicio",
            "horario_fim",
            "observacao",
            "turma",
            "instrutores",
        ]
