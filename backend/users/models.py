from django.conf import settings
from django.db import models
from decimal import Decimal

class Profile(models.Model):
    VINCULO_CHOICES = [
        ('clt', 'CLT'),
        ('pj', 'PJ'),
        ('autonomo', 'Autônomo'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    salario_bruto = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    tipo_vinculo = models.CharField(
        max_length=20,
        choices=VINCULO_CHOICES,
        null=True,
        blank=True
    )

    def calcular_inss(self):
        if not self.salario_bruto or self.tipo_vinculo != 'clt':
            return Decimal('0.00')

        salario = Decimal(self.salario_bruto)

        faixas = [
            (Decimal('1412.00'), Decimal('0.075')),
            (Decimal('2666.68'), Decimal('0.09')),
            (Decimal('4000.03'), Decimal('0.12')),
            (Decimal('7786.02'), Decimal('0.14')),
        ]

        inss = Decimal('0.00')
        salario_restante = salario
        limite_anterior = Decimal('0.00')

        for limite, aliquota in faixas:
            if salario_restante <= 0:
                break

            faixa_valor = min(limite - limite_anterior, salario_restante)
            inss += faixa_valor * aliquota

            salario_restante -= faixa_valor
            limite_anterior = limite

        return inss.quantize(Decimal('0.01'))

    @property
    def inss(self):
        return self.calcular_inss()

    @property
    def salario_liquido(self):
        if not self.salario_bruto:
            return None
        return (self.salario_bruto - self.inss).quantize(Decimal('0.01'))

    @property
    def limite_mensal(self):
        if not self.salario_liquido:
            return None
        return (self.salario_liquido * Decimal('0.7')).quantize(Decimal('0.01'))

    def __str__(self):
        return f'Profile de {self.user}'
