from rest_framework import serializers
from .models import Frequencia


class FrequenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Frequencia
        fields = "__all__"
