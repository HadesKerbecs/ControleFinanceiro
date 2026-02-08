from django.contrib import admin
from .models import Category, History, PersonDebt, SubCategory, Expense, Installment, FixedCommitment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'active')
    list_filter = ('active',)
    search_fields = ('name',)

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'active')
    list_filter = ('category', 'active')
    search_fields = ('name',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = (
        'description',
        'user',
        'subcategory',
        'payment_type',
        'debito_automatico',
        'total_value',
        'installments_quantity',
        'concluded'
    )
    list_filter = ('payment_type', 'concluded', 'debito_automatico')
    search_fields = ('description',)

@admin.register(Installment)
class InstallmentAdmin(admin.ModelAdmin):
    list_display = (
        'expense',
        'number',
        'value',
        'competencia',
        'payment_date',
        'paid'
    )
    list_filter = ('paid', 'competencia')

@admin.register(FixedCommitment)
class FixedCommitmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'value', 'active')
    list_filter = ('active',)
    search_fields = ('name',)

@admin.register(PersonDebt)
class PersonDebtAdmin(admin.ModelAdmin):
    list_display = ('person_name', 'user', 'expense', 'value', 'paid')
    list_filter = ('paid',)
    search_fields = ('person_name',)

@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    list_display = ('action', 'user', 'created_at')
    list_filter = ('action',)
    search_fields = ('description',)