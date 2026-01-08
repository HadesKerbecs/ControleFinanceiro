from django.contrib import admin
from .models import Card


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = (
        'bank_name',
        'brand',
        'user',
        'limit',
        'closing_day',
        'due_day',
        'active'
    )
    list_filter = ('active', 'brand')
    search_fields = ('bank_name',)