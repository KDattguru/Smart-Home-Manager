from django.db import models
from django.conf import settings

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('app', 'App Notification'),
        ('sms', 'SMS Notification'),
        ('email', 'Email Notification'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL,  
        null=True, blank=True
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='app')
    status = models.CharField(max_length=20, default='pending')  
    isdeleted=models.BooleanField(default=False)

    def __str__(self):
        return f"Notification ({self.notification_type}) for {self.user.username}"
