from django.utils.timezone import now
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Bill
from .serializers import BillSerializer

class BillListCreateView(generics.ListCreateAPIView):
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve non-deleted bills ordered by creation date."""
        return Bill.objects.filter(user=self.request.user, isdeleted=False).order_by('-created_at')

    def perform_create(self, serializer):
        """Assign the bill to the logged-in user on creation."""
        serializer.save(user=self.request.user)

class BillDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Ensure users can only access their own non-deleted bills."""
        return Bill.objects.filter(user=self.request.user, isdeleted=False)

    def patch(self, request, *args, **kwargs):
        """Handles bill status updates (pending, due, done)"""
        bill = self.get_object()

        # Ensure bill is not marked as deleted
        if bill.isdeleted:
            return Response({"error": "Bill has been deleted."}, status=status.HTTP_400_BAD_REQUEST)

        new_status = request.data.get("status")
        valid_statuses = ["pending", "due", "done"]

        if new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Must be one of {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        bill.status = new_status
        bill.save(update_fields=["status"])

        return Response(BillSerializer(bill).data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        """Soft delete: Mark bill as deleted instead of removing it from the DB."""
        bill = self.get_object()
        bill.isdeleted = True
        bill.save(update_fields=["isdeleted"])
        return Response({"message": "Bill deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class BillReminderView(generics.ListAPIView):
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve bills that are due today or in the future."""
        return Bill.objects.filter(
            user=self.request.user,
            due_date__gte=now().date(),
            status="due", 
            isdeleted=False
        ).order_by("due_date")

class BillCountView(APIView):
    """API to count the total number of bills for the logged-in user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Bill.objects.filter(user=request.user, isdeleted=False).count()
        return Response({"count": count}, status=status.HTTP_200_OK)
