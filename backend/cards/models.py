from datetime import date
from decimal import Decimal
from django.conf import settings
from django.db import models
from django.db.models import Sum

from django.apps import apps

class Card(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cards'
    )

    bank_name = models.CharField(max_length=100)
    brand = models.CharField(max_length=50)

    last_four_digits = models.CharField(
        max_length=4
    )

    limit = models.DecimalField(max_digits=10, decimal_places=2)

    closing_day = models.PositiveSmallIntegerField()
    due_day = models.PositiveSmallIntegerField()
    expiration_month = models.PositiveSmallIntegerField()
    expiration_year = models.PositiveSmallIntegerField()

    color = models.CharField(max_length=20, blank=True, null=True)
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.bank_name} ({self.brand})'
    
    @property
    def total_spent(self):
        Installment = apps.get_model('finance', 'Installment')

        today = date.today()
        current_competencia = today.replace(day=1)
        total = Installment.objects.filter(
            expense__card=self,
            paid=False,
            competencia__gte=current_competencia
        ).aggregate(total=Sum('value'))['total']

        return total or Decimal('0.00')

    @property
    def available_limit(self):
        return self.limit - self.total_spent

    @property
    def is_over_limit(self):
        return self.total_spent > self.limit
    
    def __str__(self):
        return f'{self.bank_name} ({self.brand})'