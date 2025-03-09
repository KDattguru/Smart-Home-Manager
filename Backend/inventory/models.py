from django.db import models
from django.conf import settings  

class InventoryItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL,  
        null=True, blank=True
    )
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    purchase_date = models.DateField()
    warranty_expiry = models.DateField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    isdeleted=models.BooleanField(default=False)
    def __str__(self):
        return self.name
