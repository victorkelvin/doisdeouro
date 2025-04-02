from rest_framework import serializers
from .models import Instrutor

class InstrutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrutor
        fields = '__all__'
