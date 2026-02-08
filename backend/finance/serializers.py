from calendar import monthrange
from rest_framework import serializers
from cards.serializers import CardSerializer
from cards.models import Card
from finance.models import Category, SubCategory, Expense, Installment, FixedCommitment, PersonDebt, History
from django.utils.timezone import now
from datetime import date

from .models import (
    Category,
    SubCategory,
    Expense,
    Installment,
    FixedCommitment,
    PersonDebt,
    History
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'active')


class SubCategorySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = SubCategory
        fields = ('id', 'name', 'category', 'category_name')

class ExpenseSerializer(serializers.ModelSerializer):
    card = serializers.PrimaryKeyRelatedField(
        queryset=Card.objects.all(),
        required=False,
        allow_null=True
    )

    subcategory = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all()
    )

    card_detail = CardSerializer(source='card', read_only=True)
    subcategory_detail = SubCategorySerializer(source='subcategory', read_only=True)

    installments_value = serializers.SerializerMethodField()
    remaining_installments = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = (
            'id',
            'description',
            'subcategory',
            'card',
            'payment_type',
            'subcategory_detail',
            'card_detail',
            'total_value',
            'installments_quantity',
            'installments_value',
            'remaining_installments',
            'purchase_date',
            'concluded',
            'debito_automatico',
        )

    def get_installments_value(self, obj):
        qty = obj.installments_quantity or 1
        return float(obj.total_value) / qty

    def get_remaining_installments(self, obj):
        today = date.today()
        return obj.installments.filter(
            paid=False,
            due_date__gte=today
        ).count()

    def validate(self, data):
        payment_type = data.get('payment_type')
        card = data.get('card')

        if payment_type == Expense.PaymentType.CARTAO:
            if card is None:
                 raise serializers.ValidationError({
                    'card': 'Cartão é obrigatório quando o pagamento é no cartão.'
                })
            else:
                data['card'] = card

        return data

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
    next_due_date = serializers.SerializerMethodField()
    days_to_due = serializers.SerializerMethodField()
    
    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    class Meta:
        model = FixedCommitment
        fields = (
            'id',
            'name',
            'value',
            'category',
            'category_name',
            'due_day',
            'active',
            'next_due_date',
            'days_to_due',
        )

    def get_next_due_date(self, obj):
        today = date.today()
        last_day = monthrange(today.year, today.month)[1]
        day = min(obj.due_day, last_day)

        due = date(today.year, today.month, day)

        if due < today:
            year = today.year + (1 if today.month == 12 else 0)
            month = 1 if today.month == 12 else today.month + 1
            last_day = monthrange(year, month)[1]
            day = min(obj.due_day, last_day)
            due = date(year, month, day)

        return due

    def get_days_to_due(self, obj):
        due = self.get_next_due_date(obj)
        return (due - date.today()).days

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
