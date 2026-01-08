from django.db import models
from django.conf import settings
from cards.models import Card
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subcategories'
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='subcategories'
    )

    name = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'name')
        verbose_name = 'Subcategory'
        verbose_name_plural = 'Subcategories'

    def __str__(self):
        return f'{self.category.name} - {self.name}'
    
class Expense(models.Model):
    class PaymentType(models.TextChoices):
        CARTAO = 'CARTAO', 'Cartão'
        PIX = 'PIX', 'PIX'
        DINHEIRO = 'DINHEIRO', 'Dinheiro'
        FIADO = 'FIADO', 'Fiado'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expenses'
    )

    card = models.ForeignKey(
        Card,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='expenses'
    )

    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.PROTECT,
        related_name='expenses'
    )

    payment_type = models.CharField(
        max_length=20,
        choices=PaymentType.choices
    )

    description = models.CharField(max_length=255)
    total_value = models.DecimalField(max_digits=10, decimal_places=2)
    installments_quantity = models.PositiveSmallIntegerField(default=1)

    purchase_date = models.DateField()
    concluded = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.description} - {self.total_value}'
    
    def generate_installments(self):
        if self.installments.exists():
            return

        installment_value = self.total_value / Decimal(self.installments_quantity).quantize(Decimal('0.01'))

        for i in range(1, self.installments_quantity + 1):
            Installment.objects.create(
                expense=self,
                number=i,
                value=installment_value,
                due_date=self.purchase_date + timedelta(days=30 * i)
            )
    
class Installment(models.Model):
    expense = models.ForeignKey(
        Expense,
        on_delete=models.CASCADE,
        related_name='installments'
    )

    number = models.PositiveSmallIntegerField()
    value = models.DecimalField(max_digits=10, decimal_places=2)

    due_date = models.DateField()
    paid = models.BooleanField(default=False)
    paid_at = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('expense', 'number')
        ordering = ['number']

    def __str__(self):
        return f'Parcela {self.number} - {self.value}'

class FixedCommitment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='fixed_commitments'
    )

    name = models.CharField(max_length=150)
    value = models.DecimalField(max_digits=10, decimal_places=2)

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} - {self.value}'

class PersonDebt(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='person_debts'
    )

    person_name = models.CharField(max_length=100)

    expense = models.ForeignKey(
        Expense,
        on_delete=models.CASCADE,
        related_name='person_debts'
    )

    value = models.DecimalField(max_digits=10, decimal_places=2)

    paid = models.BooleanField(default=False)
    paid_at = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.person_name} - {self.value}'
    
class PersonDebt(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='person_debts'
    )

    person_name = models.CharField(max_length=100)

    expense = models.ForeignKey(
        Expense,
        on_delete=models.CASCADE,
        related_name='person_debts'
    )

    value = models.DecimalField(max_digits=10, decimal_places=2)

    paid = models.BooleanField(default=False)
    paid_at = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.person_name} - {self.value}'

class History(models.Model):
    class ActionType(models.TextChoices):
        CREATE = 'CREATE', 'Criado'
        UPDATE = 'UPDATE', 'Atualizado'
        PAY = 'PAY', 'Pago'
        DELETE = 'DELETE', 'Excluído'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='histories'
    )

    action = models.CharField(
        max_length=20,
        choices=ActionType.choices
    )

    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.action} - {self.description[:30]}'
