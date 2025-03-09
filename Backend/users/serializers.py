from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'phone_number', 'profile_picture']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'phone_number', 'profile_picture', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data.get('role', 'member'),
            phone_number=validated_data.get('phone_number', None),
            profile_picture=validated_data.get('profile_picture', None),
            password=validated_data['password'],
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        print("Received Data in Serializer:", data)  # Debugging

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        # Authenticate the user using the custom backend
        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if user is None:
            print("Authentication failed: Invalid email or password")  # Debugging
            raise serializers.ValidationError("Invalid email or password.")

        print("Authenticated User:", user)  # Debugging

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user'] = user

        return data