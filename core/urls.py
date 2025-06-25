from django.urls import path
from core.views import LoginView, RegisterView, ProfileView
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import LogoutView
from .views import DeviceListCreateView
from .views import DeviceListCreateView, DeviceDetailView
from .views import (
    CreateRentalRequestView, MyRentalsView, ManageRequestsView, ApproveRejectRentalView
)
from .views import ChatListCreateView


urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('devices/', DeviceListCreateView.as_view(), name='device-list-create'),
    path('devices/<int:pk>/', DeviceDetailView.as_view(), name='device-detail'),
    path('rent/<int:device_id>/', CreateRentalRequestView.as_view(), name='create-rent'),  # POST
    path('my-rentals/', MyRentalsView.as_view(), name='my-rentals'),                       # GET
    path('manage-requests/', ManageRequestsView.as_view(), name='manage-requests'),       # GET
    path('approve-request/<int:pk>/', ApproveRejectRentalView.as_view(), name='approve-reject'), 
    path('requests/<int:request_id>/chat/', ChatListCreateView.as_view(), name='chat'),

]
