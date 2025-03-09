from django.urls import path
from .views import InventoryListCreateView, InventoryDetailView, InventoryCountView

urlpatterns = [
    path('', InventoryListCreateView.as_view(), name='inventory-list-create'),  
    path('<int:pk>/', InventoryDetailView.as_view(), name='inventory-detail'),  
    path('count/', InventoryCountView.as_view(), name='inventory-count'),  
]
