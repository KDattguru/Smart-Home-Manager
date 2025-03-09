from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkReadView,
    MarkAllNotificationsReadView,
    DeleteNotificationView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('mark-read/<int:pk>/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('mark-all-read/', MarkAllNotificationsReadView.as_view(), name='notification-mark-all-read'),
    path('delete/<int:pk>/', DeleteNotificationView.as_view(), name='notification-delete'),
]
