from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    """Fetch all notifications for the authenticated user"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


class NotificationMarkReadView(generics.UpdateAPIView):
    """Mark a single notification as read"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user, is_read=False)

    def perform_update(self, serializer):
        serializer.save(is_read=True)  # Mark as read


class MarkAllNotificationsReadView(generics.GenericAPIView):
    """Mark all notifications as read for the authenticated user"""
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        notifications = Notification.objects.filter(user=request.user, is_read=False)
        notifications.update(is_read=True)
        return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK)


class DeleteNotificationView(generics.DestroyAPIView):
    """Delete a single notification"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
