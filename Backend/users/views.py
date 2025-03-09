from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

class RegisterView(generics.CreateAPIView):
    """Register a new user"""
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("Request Data:", request.data)  # Debugging API Input

        serializer = LoginSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            print("Serializer Errors:", serializer.errors)  # Debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt to authenticate using Django's built-in authentication
        user = authenticate(request, email=email, password=password)

        # If authentication fails, manually check user credentials
        if user is None:
            try:
                user = CustomUser.objects.get(email=email)
                if not user.check_password(password):  # Verify password manually
                    raise Exception("Invalid credentials")
            except CustomUser.DoesNotExist:
                return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
        }, status=status.HTTP_200_OK)


class ProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("Authenticated User:", request.user)  # Debugging
        if not request.user:
            return Response({"detail": "User not found", "code": "user_not_found"}, status=401)
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'phone_number': user.phone_number,
            'profile_picture': user.profile_picture.url if user.profile_picture else None
        })


@api_view(["GET"])
@permission_classes([IsAuthenticated])  
def list_users(request):
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class UserCountView(APIView):
    """Returns total admin count and, if the user is admin, total user count."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_admins = CustomUser.objects.filter(is_staff=True).count()
        total_users = CustomUser.objects.filter(is_staff=False).count()

        data = {"total_admins": total_admins}

        if request.user.is_staff:  
            data["total_users"] = total_users

        return Response(data)
