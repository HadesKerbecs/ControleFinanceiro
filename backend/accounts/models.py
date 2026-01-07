from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class TipoVinculo(models.TextChoices):
        CLT = 'CLT', 'CLT'
        PJ = 'PJ', 'PJ'
        AUTONOMO = 'AUTONOMO', 'Autônomo'

    salario_bruto = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    tipo_vinculo = models.CharField(
        max_length=20,
        choices=TipoVinculo.choices,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
