from rest_framework import serializers
from .models import Card

class CardSerializer(serializers.ModelSerializer):
    total_spent = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    available_limit = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    is_over_limit = serializers.BooleanField(read_only=True)

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
