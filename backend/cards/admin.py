from django.contrib import admin
from .models import Card


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('bank_name', 'brand', 'user', 'limit', 'active')
    list_filter = ('active', 'brand')
    search_fields = ('bank_name', 'brand')
