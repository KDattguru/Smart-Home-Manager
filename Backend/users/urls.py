from django.urls import path
from .views import RegisterView, LoginView, ProfileView, list_users, UserCountView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('list-users/', list_users, name='list-users'),
    path('count/', UserCountView.as_view(), name='user-count'),  
]
