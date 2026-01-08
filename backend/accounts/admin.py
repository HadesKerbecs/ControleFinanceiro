from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'username',
        'email',
        'tipo_vinculo',
        'salario_bruto',
        'is_active',
        'is_staff'
    )
    search_fields = ('username', 'email')
    list_filter = ('tipo_vinculo', 'is_active')
