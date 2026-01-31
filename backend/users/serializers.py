from rest_framework import serializers
from .models import Profile

class UserProfileSerializer(serializers.ModelSerializer):
    inss = serializers.SerializerMethodField()
    salario_liquido = serializers.SerializerMethodField()
    limite_mensal = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'salario_bruto',
            'tipo_vinculo',
            'inss',
            'salario_liquido',
            'limite_mensal',
        ]

    def get_inss(self, obj):
        return obj.inss

    def get_salario_liquido(self, obj):
        return obj.salario_liquido

    def get_limite_mensal(self, obj):
        return obj.limite_mensal
