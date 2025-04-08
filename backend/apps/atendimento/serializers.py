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
    alunos_presentes = serializers.SerializerMethodField()
    turma = serializers.SerializerMethodField()
    instrutores = serializers.SerializerMethodField()

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

    def get_alunos_presentes(self, obj):
        return [aluno.nome for aluno in obj.alunos_presentes.all()]
    def get_turma(self, obj):
        return obj.turma.nome if obj.turma else None
    def get_instrutores(self, obj):
        return [instrutor.nome for instrutor in obj.instrutores.all()]
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["alunos_presentes"] = self.get_alunos_presentes(instance)
        ret["turma"] = self.get_turma(instance)
        ret["instrutores"] = self.get_instrutores(instance)
        return ret
    
    