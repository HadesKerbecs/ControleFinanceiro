from rest_framework import serializers
from .models import User, Card
from .models import (
    Category,
    SubCategory,
    Expense,
    Installment,
    FixedCommitment,
    PersonDebt,
    History
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'salario_bruto',
            'tipo_vinculo',
        )

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

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'active')

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ('id', 'name', 'category', 'active')

class ExpenseSerializer(serializers.ModelSerializer):
    installments_value = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = (
            'id',
            'description',
            'subcategory',
            'payment_type',
            'total_value',
            'installments_quantity',
            'installments_value',
            'purchase_date',
            'concluded',
        )

    def get_installments_value(self, obj):
        return obj.total_value / obj.installments_quantity

class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = (
            'id',
            'expense',
            'number',
            'value',
            'due_date',
            'paid',
        )

class FixedCommitmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FixedCommitment
        fields = (
            'id',
            'name',
            'value',
            'start_date',
            'end_date',
            'active',
        )

class PersonDebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonDebt
        fields = (
            'id',
            'person_name',
            'expense',
            'value',
            'paid',
        )

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = (
            'id',
            'action',
            'description',
            'created_at',
        )
