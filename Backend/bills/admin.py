from django.contrib import admin
from .models import Bill

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ['name', 'amount', 'due_date', 'status', 'created_at', 'isdeleted']
    list_filter = ['status', 'isdeleted']
    search_fields = ['name', 'description']
    ordering = ['due_date']
    readonly_fields = ['created_at']
