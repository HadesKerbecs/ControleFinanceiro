from django.db import models
from django.conf import settings
from cards.models import Card

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