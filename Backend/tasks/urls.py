from django.urls import path
from .views import TaskListCreateView, TaskDetailView, TaskCountView

urlpatterns = [
    path('', TaskListCreateView.as_view(), name='task-list-create'), 
    path('<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('count/', TaskCountView.as_view(), name='task-count'),  
]
