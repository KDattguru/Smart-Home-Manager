from rest_framework import generics
from .models import InventoryItem
from .serializers import InventorySerializer
from rest_framework.permissions import IsAuthenticated
import logging
from rest_framework.views import APIView
from rest_framework.response import Response


logger = logging.getLogger(__name__)

class InventoryListCreateView(generics.ListCreateAPIView):
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Ensure users only see their own inventory items.
        """
        return InventoryItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically assign the logged-in user to the inventory item.
        """
        logger.info(f"User: {self.request.user}, Data: {self.request.data}")
        serializer.save(user=self.request.user)

class InventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Ensure users can only access their own inventory items.
        """
        return InventoryItem.objects.filter(user=self.request.user)



class InventoryCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = InventoryItem.objects.filter(user=request.user).count()  
        return Response({"count": count})
