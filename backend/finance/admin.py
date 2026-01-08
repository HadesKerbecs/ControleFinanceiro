from django.contrib import admin
from .models import Category, SubCategory, Expense, Installment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'active')
    list_filter = ('active',)
    search_fields = ('name',)

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'user', 'active')
    list_filter = ('category', 'active')
    search_fields = ('name',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = (
        'description',
        'user',
        'subcategory',
        'payment_type',
        'total_value',
        'installments_quantity',
        'concluded'
    )
    list_filter = ('payment_type', 'concluded')
    search_fields = ('description',)

@admin.register(Installment)
class InstallmentAdmin(admin.ModelAdmin):
    list_display = (
        'expense',
        'number',
        'value',
        'due_date',
        'paid'
    )
    list_filter = ('paid',)