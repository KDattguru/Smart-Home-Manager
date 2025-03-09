from django.urls import path
from .views import BillListCreateView, BillDetailView, BillReminderView, BillCountView

urlpatterns = [
    path('', BillListCreateView.as_view(), name='bill-list-create'),  
    path('<int:pk>/', BillDetailView.as_view(), name='bill-detail'),
    path('reminders/', BillReminderView.as_view(), name='bill-reminders'),
    path('count/', BillCountView.as_view(), name='bill-count'),  
]
