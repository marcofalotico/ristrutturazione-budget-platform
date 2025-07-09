from django.urls import path
from .views import RegisterView, CategoriaListCreate, CategoriaRetrieveUpdate
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('spese/', CategoriaListCreate.as_view()),
    path('spese/<int:pk>/', CategoriaRetrieveUpdate.as_view()),
]
