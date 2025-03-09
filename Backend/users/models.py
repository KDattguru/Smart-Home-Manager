from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Group, Permission

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('member', 'Member'),
        ('guest', 'Guest'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', default='profile_pictures/default.png', blank=True, null=True)
    email = models.EmailField(unique=True)
    isdeleted=models.BooleanField(default=False)
    
    
    def delete(self, *args, **kwargs):
        from tasks.models import Task  
        from django.contrib.admin.models import LogEntry  
        from notifications.models import Notification  
        from bills.models import Bill  
        from inventory.models import InventoryItem  

        Task.objects.filter(user=self).update(user=None)
        Notification.objects.filter(user=self).update(user=None)
        Bill.objects.filter(user=self).update(user=None)
        InventoryItem.objects.filter(user=self).update(user=None)

        self.groups.clear()
        self.user_permissions.clear()

        LogEntry.objects.filter(user=self).delete()

        super().delete(*args, **kwargs)

    def __str__(self):
        return self.username