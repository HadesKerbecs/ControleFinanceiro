from rest_framework import serializers
from .models import Card


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = (
            'id',
            'bank_name',
            'brand',
            'limit',
            'closing_day',
            'due_day',
            'active',
        )
