# tasks/models.py
from django.db import models
from django.conf import settings

class Task(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL,  
        null=True, 
        blank=True
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField()
    completed = models.BooleanField(default=False)
    isdeleted=models.BooleanField(default=False)

    def __str__(self):
        return self.title
