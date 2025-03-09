from django.contrib import admin
from .models import InventoryItem

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'purchase_date', 'warranty_expiry', 'quantity']
    search_fields = ['name', 'category']
    list_filter = ['category']
