from django.db import models
from django.conf import settings
from django.utils.timezone import now

class Bill(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL,  # Avoid on_delete=models.CASCADE
        null=True, blank=True
    )
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=now)  
    isdeleted=models.BooleanField(default=False)
    def update_status(self):
        if self.status == "pending" and self.due_date < now().date():
            self.status = "overdue"
            self.save()

    def mark_as_paid(self):
        self.status = "paid"
        self.save()

    def __str__(self):
        return f"Bill #{self.id} - {self.name} ({self.status})"