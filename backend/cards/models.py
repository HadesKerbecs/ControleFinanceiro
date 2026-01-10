from django.conf import settings
from django.db import models
from django.db.models import Sum

class Card(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cards'
    )

    bank_name = models.CharField(max_length=100)
    brand = models.CharField(max_length=50)  # Visa, MasterCard, etc.
    limit = models.DecimalField(max_digits=10, decimal_places=2)

    closing_day = models.PositiveSmallIntegerField()
    due_day = models.PositiveSmallIntegerField()

    color = models.CharField(max_length=20, blank=True, null=True)
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.bank_name} ({self.brand})'
    
    @property
    def total_spent(self):
        return self.expenses.aggregate(
            total=Sum('total_value')
        )['total'] or 0

    @property
    def available_limit(self):
        return self.limit - self.total_spent

    @property
    def is_over_limit(self):
        return self.total_spent > self.limit